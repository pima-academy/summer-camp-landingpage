# Hướng dẫn viết bài cho Blog PiMA

Mỗi bài viết trên [pimavn.com/blog](https://pimavn.com/blog/) là một file Markdown trong thư mục này. Bạn không cần đụng tới code của site: viết file, tải lên GitHub, mở pull request; CI kiểm tra bài, và khi pull request được merge thì bài được đăng.

Bài mẫu để copy: [`bai-viet-mau.md`](./bai-viet-mau.md). Bài này có `draft: true` nên không hiện trên site; khi copy để viết bài thật, nhớ xoá dòng đó.

## 1. Một bài gồm những gì

- **Bài không có ảnh**: một file `<slug>.md`, ví dụ `nguyen-ly-dirichlet.md`.
- **Bài có ảnh** (kể cả chỉ có ảnh bìa): một thư mục `<slug>/` chứa file `index.md` và các ảnh của bài, ví dụ:

  ```
  nguyen-ly-dirichlet/
  ├── index.md
  ├── bia.jpg
  └── hinh-1.png
  ```

`<slug>` là tên file hoặc tên thư mục, và cũng là đường dẫn của bài: `pimavn.com/blog/<slug>/`. Đặt slug bằng chữ thường không dấu, nối các từ bằng dấu gạch ngang. Đừng đổi slug sau khi bài đã đăng, vì link cũ sẽ không còn dẫn tới bài.

## 2. Front matter

Đầu mỗi bài là phần front matter, nằm giữa hai dòng `---`:

```yaml
---
title: "Bài toán chia kẹo và nguyên lý Dirichlet"
date: 2026-11-27
author: "Nguyễn Văn A"
cover: ./bia.jpg
description: "Một câu ngắn giới thiệu bài, hiện trên thẻ bài viết ở trang Blog."
draft: false
---
```

| Trường | Bắt buộc | Ý nghĩa |
| --- | --- | --- |
| `title` | Có | Tiêu đề bài. Nên để trong ngoặc kép, nhất là khi tiêu đề có dấu `:`. |
| `date` | Có | Ngày đăng, dạng `YYYY-MM-DD`. Site hiện ngày dạng `dd/mm/yyyy`, và trang Blog xếp bài mới nhất lên đầu. |
| `author` | Không | Tên tác giả, hiện dưới tiêu đề. |
| `cover` | Không | Ảnh bìa, là một file ảnh nằm cạnh `index.md`, viết `./ten-anh.jpg`. Ảnh bìa hiện trên thẻ bài viết và đầu trang bài. Bài không có ảnh bìa thì thẻ hiện logo PiMA. |
| `description` | Không | Tóm tắt hiện trên thẻ bài viết. |
| `draft` | Không | `true` để giữ bài ở dạng nháp (xem mục 6). Mặc định là `false`. |

Thiếu `title` hoặc `date`, hay một trường sai kiểu (ví dụ ngày viết sai dạng, ảnh bìa không có trong thư mục), thì CI báo lỗi.

**Tóm tắt trên thẻ bài viết** được lấy theo thứ tự:

1. `description`, nếu có;
2. nếu không, phần chữ đứng trước dòng `<!--more-->` trong bài;
3. nếu không có cả hai, đoạn văn đầu tiên của bài (bỏ qua tiêu đề mục và ảnh).

Tóm tắt hiện dưới dạng chữ thường (định dạng bị bỏ, công thức đọc thành chữ) và bị cắt ở khoảng 180 ký tự, kết thúc bằng "…".

## 3. Viết nội dung

- Tiêu đề trong bài **bắt đầu từ `##`**, rồi `###`, `####`. Tiêu đề lớn `#` đã dành cho `title` của bài.
- Đoạn văn cách nhau bằng một dòng trống.
- Dùng được các cú pháp Markdown quen thuộc: **đậm** (`**…**`), *nghiêng* (`*…*`), danh sách (`-` hoặc `1.`), trích dẫn (`>`), bảng, link (`[chữ hiện ra](https://…)`), code (đặt giữa hai dòng ```` ``` ````, ghi tên ngôn ngữ ngay sau, ví dụ ```` ```python ````).
- Code được tô màu theo ngôn ngữ ghi sau ```` ``` ````. Kết quả chạy code (output) đặt trong một khối ```` ```text ```` riêng ngay dưới khối code: khối này có nền trắng và viền mảnh, tách khỏi code phía trên. Dòng code dài cuộn ngang trong khung, không làm tràn trang trên điện thoại.

## 4. Ảnh

```markdown
![Mô tả nội dung ảnh](./hinh-1.png "Chú thích hiện dưới ảnh")
```

- Phần trong `[…]` là **mô tả ảnh (alt)**, dành cho người dùng trình đọc màn hình. Phần này bắt buộc: ảnh không có mô tả làm CI báo lỗi.
- Phần trong ngoặc kép là **chú thích**, hiện dưới ảnh. Không cần chú thích thì bỏ phần này: `![Mô tả](./hinh-1.png)`.
- Ảnh nằm trong thư mục của bài, cạnh `index.md`; đường dẫn bắt đầu bằng `./`. Đặt tên file ảnh không dấu, không khoảng trắng.
- Đặt mỗi ảnh trên một dòng riêng, có dòng trống phía trên và phía dưới.
- Định dạng nhận: JPG, PNG, WebP, AVIF, GIF (đuôi file viết hoa như `IMG_0001.JPG` cũng được). Ảnh HEIC của iPhone cần chuyển sang JPG trước.
- Ảnh chụp thẳng từ máy ảnh hay xuất từ slide dùng được ngay: site tự thu nhỏ và nén ảnh. Giới hạn duy nhất là GitHub chỉ nhận file dưới 25 MB khi tải lên qua trình duyệt.
- Người đọc bấm vào ảnh để xem toàn màn hình, và chuyển qua lại giữa các ảnh của bài.

## 5. Công thức

Công thức viết bằng LaTeX và được KaTeX dựng sẵn khi build, nên người đọc thấy công thức ngay khi trang tải xong.

- **Công thức trong dòng**: đặt giữa hai dấu `$`, ví dụ `Với mọi $n \ge 1$, ta có …`.
- **Công thức riêng dòng**: đặt giữa hai dòng `$$`, mỗi dòng `$$` đứng riêng, có dòng trống phía trên và phía dưới:

  ```markdown
  Tổng của $n$ số nguyên dương đầu tiên là

  $$
  \sum_{i=1}^{n} i = \frac{n(n+1)}{2}
  $$

  và công thức này chứng minh được bằng quy nạp.
  ```

- Chữ tiếng Việt trong công thức đặt trong `\text{…}`, ví dụ `$f(x) = 0 \text{ với mọi } x < 0$`.
- Muốn viết dấu đô la thường (không phải công thức), viết `\$`, ví dụ `giá \$5`. Hai dấu `$` không có `\` trong cùng một đoạn sẽ bị hiểu là một công thức.

Công thức KaTeX không đọc được làm CI báo lỗi. Log của CI ghi tên file, công thức bị lỗi và thông báo của KaTeX, ví dụ:

```
KaTeX cannot typeset a formula: KaTeX parse error: Undefined control sequence: \SI at position 1: \̲S̲I̲{3}{m}
```

"at position 1" là vị trí ký tự trong công thức, và phần bị gạch dưới là chỗ KaTeX dừng lại.

### Giới hạn khi viết công thức

KaTeX chỉ hiểu phần **chế độ toán (math mode)** của LaTeX, không phải LaTeX đầy đủ: không có preamble, không có gói lệnh, không có văn bản LaTeX ngoài công thức. Danh sách đầy đủ các lệnh được hỗ trợ: [katex.org/docs/supported](https://katex.org/docs/supported).

**Dùng được:**

- Các lệnh toán thông thường: `\frac`, `\sqrt`, `\sum`, `\int`, `\lim`, `\binom`, chỉ số trên/dưới, chữ Hy Lạp, `\mathbb`, `\mathcal`, `\mathbf`, `\operatorname`, `\left( … \right)`…
- Môi trường `align`, `gather`, `equation` (cùng các bản có dấu `*`): chỉ dùng trong công thức riêng dòng `$$`. Bản không có `*` tự đánh số (1), (2)…; bản có `*` không đánh số.
- `cases`, `array`, `aligned` và ma trận (`matrix`, `pmatrix`, `bmatrix`, `vmatrix`…): dùng được cả trong dòng lẫn riêng dòng.
- `\text{…}` với chữ tiếng Việt.
- `\tag{…}` để tự đặt nhãn cho công thức, chỉ trong công thức riêng dòng.
- `\newcommand` bên trong một công thức, ví dụ `$\newcommand{\pr}{\mathbb{P}} \pr(A) = 1$`. Lệnh mới chỉ có tác dụng trong chính công thức đó. Tên lệnh phải chưa có sẵn: `\R`, `\N`, `\Z` đã có nghĩa trong KaTeX, nên chọn tên khác hoặc dùng `\renewcommand`.

**Không dùng được** (CI báo lỗi):

- `\usepackage` và mọi lệnh của gói ngoài, ví dụ `\SI`, `\DeclareMathOperator` (thay bằng `\operatorname{argmax}`).
- `tabular` (dùng bảng Markdown hoặc `array`), `enumerate`, `itemize` (dùng danh sách Markdown).
- TikZ: vẽ hình bằng công cụ khác rồi xuất ra ảnh và chèn như mục 4.
- `\label`, `\ref`, `\eqref`: đánh số tay bằng `\tag{…}` và nhắc tới công thức bằng chữ, ví dụ "theo (1)".
- `multline` (dùng `align` hoặc `gather`).
- Một lệnh định nghĩa ở công thức này rồi dùng ở công thức khác: mỗi công thức tự định nghĩa lại lệnh của mình.
- `\href`, `\url`, `\includegraphics` trong công thức: CI **không** báo lỗi, nhưng site hiện lệnh thành chữ đỏ. Dùng link và ảnh Markdown thay thế.

**Quy tắc Markdown cho công thức:**

- Chỉ dùng `$…$` và `$$…$$`. Cú pháp `\(…\)` và `\[…\]` **không** được hiểu là công thức, và CI **không** báo lỗi: site hiện nguyên chữ, ví dụ `(x^2)`.
- Môi trường (`\begin{align}…\end{align}`, `\begin{cases}…`) phải nằm trong `$$…$$`. Môi trường đặt ngoài `$` cũng hiện nguyên chữ mà CI không báo.
- Hai dòng `$$` của công thức riêng dòng đứng riêng, không chung dòng với chữ. Viết `$$x^2$$` giữa một câu thì công thức nằm trong dòng.
- Dấu đô la thường viết `\$`.

## 6. Bài nháp

`draft: true` giữ bài khỏi site: bài không có trang, không có trong danh sách Blog và không có trong sitemap. Bài nháp vẫn được CI kiểm tra front matter và công thức, nên có thể merge một bài chưa xong mà không đăng nó. Khi bài sẵn sàng, đổi thành `draft: false` (hoặc xoá dòng này) trong một pull request mới.

## 7. Đăng bài qua GitHub

Bạn cần quyền ghi (write) vào repo `pima-academy/summer-camp-landingpage`. Nếu GitHub đề nghị tạo fork, nghĩa là tài khoản chưa có quyền này.

1. **Chọn nhánh đích.** Nếu [pimavn.com/blog](https://pimavn.com/blog/) đã mở được, nhánh đích là `main`. Nếu chưa (site mới chưa thay site cũ), nhánh đích là `dev`.
2. Mở repo trên GitHub, chọn nhánh đích ở nút chọn nhánh, rồi vào thư mục `src/content/blog/`.
3. Bấm **Add file → Upload files**, rồi **kéo thả** thư mục bài (hoặc file `<slug>.md`) vào trang. Kéo thả cả thư mục thì GitHub giữ nguyên thư mục; nút "choose your files" chỉ chọn được từng file.
4. Ở phần **Commit changes**: ghi một dòng như `Thêm bài nguyen-ly-dirichlet`, chọn **Create a new branch for this commit and start a pull request**, đặt tên nhánh như `bai-viet/nguyen-ly-dirichlet`, rồi bấm **Propose changes**.
5. Ở trang **Open a pull request**, kiểm tra ô `base:` là nhánh đích ở bước 1 (đổi lại nếu khác), rồi bấm **Create pull request**.
6. CI (check **Build**) tự chạy trong vài phút.
   - Dấu xanh: bài hợp lệ.
   - Dấu đỏ: bấm **Details** và mở bước `npm run build` (front matter, công thức, ảnh) hoặc `npm test` (ví dụ ảnh thiếu mô tả) để xem lỗi. Sửa ngay trên GitHub: mở file trong nhánh `bai-viet/…` của bạn, bấm biểu tượng bút chì, sửa, rồi commit thẳng vào nhánh đó. CI tự chạy lại.
7. Khi CI xanh, merge pull request. Sau khi site mới thay site cũ, merge vào `main` là bài được đăng. Trước đó, bài vào `dev` và lên site cùng lần phát hành kế tiếp.

Sửa một bài đã đăng cũng theo các bước trên: sửa file trong một nhánh mới rồi mở pull request.
