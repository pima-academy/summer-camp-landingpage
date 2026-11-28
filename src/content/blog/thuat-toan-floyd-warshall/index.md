---
title: "Thuật toán Floyd-Warshall"
date: 2019-12-23
cover: ./cover.jpg
---

Khi nhắc đến thuật toán để tìm đường đi ngắn nhất trong đồ thị, người ta sẽ thường nghĩ tới những thuật toán dễ tiếp cận và có thể chạy trong giới hạn cho phép như Breadth First Search, Dijkstra hay Bellman-Ford. Tuy nhiên, ba thuật toán trên đều chỉ có thể tìm được đường đi ngắn nhất từ một đỉnh nguồn nhất định đến các đỉnh khác và do đó, trong một số trường hợp cụ thể cần chỉ ra đường đi ngắn nhất của mọi cặp đỉnh trong đồ thị, các thuật toán này sẽ hoạt động chưa hiệu quả khi phải chạy lặp đi lặp lại khá nhiều thao tác.

Floyd-Warshall chính là người bạn có thể giải quyết vấn đề này của chúng ta chỉ trong một lần chạy duy nhất. Hơn thế nữa, cách tiếp cận và cài đặt của nó cũng khá đơn giản và quen thuộc.

## Lịch sử

Floyd-Warshall là thuật toán được ứng dụng rộng rãi trong các bài toán về Lý thuyết tính toán (Theory of Computation). Thuật toán được phát triển đầu tiên bởi Bernard Roy năm 1959, sau đó nó được công nhận bởi Robert Floyd và Stephen Warshall năm 1962 qua bài toán tìm bao đóng của đồ thị (transitive closure) và cũng liên quan chặt chẽ với thuật toán Kleene dùng để chuyển đổi Automata hữu hạn đơn định (deterministic finite automaton) sang biểu thức chính quy (regular expression).

## Thuật toán

![Ví dụ chạy thuật toán: (1) đồ thị vô hướng 5 đỉnh với các cạnh 1–2 độ dài 5, 2–3 độ dài 2, 3–4 độ dài 7, 1–4 độ dài 9, 4–5 độ dài 2, 1–5 độ dài 1; (2) mảng dist ban đầu; (3) mảng dist sau khi xét đỉnh trung gian 1, thêm 2–4 độ dài 14 và 2–5 độ dài 6; (4) mảng dist sau khi xét đỉnh trung gian 2, thêm 1–3 độ dài 7 và 3–5 độ dài 8](./hinh-1.jpg)

Floyd-Warshall là ví dụ điển hình của kỹ thuật quy hoạch động (Dynamic Programming). Kỹ thuật này sẽ chia bài toán thành các bài toán con nhỏ hơn, sau đó kết hợp lời giải tối ưu của các bài toán con đó lại để giải bài toán lớn toàn cục. Ý tưởng của Floyd-Warshall như sau: thuật toán sẽ thực hiện so sánh giữa đường đi ngắn nhất hiện tại của hai điểm bất kỳ với một đường đi trung gian và cập nhật đường đi có độ dài nhỏ hơn. Giả sử với 2 đỉnh $u$ và $v$, thuật toán sẽ xét một điểm trung gian $k$, so sánh đường đi hiện thời giữa $u$ và $v$ với tổng độ dài đường đi ngắn nhất từ $u$ và từ $v$ tới đỉnh $k$ đó và cập nhật lại đường đi ngắn nhất giữa $u$ và $v$ là đường đi nhỏ hơn. Thuật toán sẽ kết thúc khi đã xét hết tất cả các điểm trung gian (là tất cả các đỉnh trong đồ thị).

Ngoài ra vì đặc thù thuật toán, Floyd-Warshall sẽ tổ chức dữ liệu trong một mảng 2 chiều với mỗi phần tử là đường đi ngắn nhất giữa 2 đỉnh bất kỳ. Giá trị mỗi phần tử sẽ là $+\infty$ nếu không có đường nối trực tiếp giữa 2 đỉnh, ngược lại, giá trị này sẽ bằng trọng số của đường nối đó.

**Ví dụ:** Ta xét đồ thị vô hướng (1). Mảng hai chiều `dist` chứa đường đi ngắn nhất ban đầu sẽ được khởi tạo như hình (2). Ta sẽ phân tích tuần tự theo ý tưởng thuật toán.

Đầu tiên, lấy $k = 1$ là đỉnh trung gian. Ta thấy xuất hiện đường đi từ đỉnh 2 tới đỉnh 4 (độ dài 14), và từ đỉnh 2 tới đỉnh 5 (độ dài 6). Đường đi trung gian qua đỉnh 1 để đi từ đỉnh 4 tới đỉnh 5 không tối ưu về chiều dài ($9 + 1 > 2$) nên ta không cập nhật lại đường đi ngắn nhất giữa 2 đỉnh 4 và 5. Mảng `dist` lúc này trở thành (3).

Tiếp theo, ta duyệt tới $k = 2$. Đường đi từ 3 tới 1 (độ dài 7), từ 3 tới 5 (độ dài 8) được hình thành. Đường đi từ 3 tới 4 không cập nhật độ dài ($7 < 2 + 5 + 9$). Mảng `dist` lúc này trở thành (4).

Cứ tiếp tục lựa chọn điểm trung gian $k$ như vậy cho tới hết, ta sẽ thu được mảng 2D hoàn chỉnh.

Giả sử, qua mảng này, ta thấy đường đi ngắn nhất từ đỉnh 2 tới đỉnh 4 có độ dài 8. Dựa theo đồ thị thì nó là đoạn đường $2 \to 1 \to 5 \to 4$.

## Mã giả

![Mã giả 14 dòng của hàm floydWarshall: dòng 2 đến 9 khởi tạo mảng dist, bằng 0 nếu i = j, bằng trọng số nếu (i, j) là một cạnh, ngược lại bằng vô cùng; dòng 10 đến 14 là ba vòng lặp k, i, j từ 1 đến |V|, cập nhật dist[i][j] thành dist[i][k] + dist[k][j] khi tổng này nhỏ hơn](./hinh-2.jpg)

Dựa vào ảnh, ta thấy quá trình cài đặt thuật toán Floyd-Warshall khá đơn giản, có thể chia làm 2 công đoạn:

- Dòng 2-9: Khởi tạo ma trận `dist` $|V| \times |V|$ chứa chi phí đường đi ngắn nhất, trong đó, với mỗi cặp đỉnh $(i, j)$:
  - Dòng 4-5: Nếu cùng đỉnh thì khoảng cách `dist[i][j] = 0`.
  - Dòng 6-7: Nếu hai đỉnh có đường nối trực tiếp với nhau, chi phí là trọng số của đường nối.
  - Nếu không có đường nối trực tiếp, chi phí ban đầu mặc định là $+\infty$.
- Dòng 10-14: Tính toán giá trị đường đi ngắn nhất:
  - Chọn lần lượt từng đỉnh của đồ thị làm đỉnh trung gian $k$.
  - Chọn một cặp đỉnh phân biệt trong đồ thị $(i, j)$.
  - Đường đi ngắn nhất từ $i$ tới $j$ là giá trị nhỏ hơn của:
    - Đường đi ngắn nhất hiện tại từ $i$ tới $j$.
    - Tổng đường đi ngắn nhất hiện tại từ $i$ tới $k$ và từ $k$ tới $j$.

## Độ phức tạp thuật toán

Với $N$ là số đỉnh của đồ thị, hoàn toàn dễ nhận ra thuật toán có độ phức tạp thời gian $O(N^3)$ với 3 vòng lặp lồng nhau. Do đó, thuật toán chỉ nên áp dụng với những đồ thị có số đỉnh nhỏ (thường chỉ tới dưới 400 đỉnh). Thuật toán chạy tốt nhất cho đồ thị dày (dense graphs - đồ thị có nhiều cạnh) và không hiệu quả ở đồ thị thưa (sparse graph – đồ thị ít cạnh). Đối với đồ thị thưa, sử dụng thuật toán Johnson sẽ thích hợp hơn.

Độ phức tạp không gian của thuật toán sẽ là $O(N^2)$ bởi cấu trúc lưu trữ ma trận 2 chiều.

## Ứng dụng

Floyd-Warshall được sử dụng để giải quyết những bài toán thuộc họ All Pairs Shortest Path (APSP), dùng để tính toán đường đi ngắn nhất giữa mọi cặp điểm trong đồ thị có hướng. Trong thực tế, một ứng dụng điển hình của thuật toán này là xây dựng mạng lưới giao thông để tối ưu hóa đường đi ở các thành phố lớn.

Không chỉ dừng lại ở việc tìm đường đi ngắn nhất, Floyd-Warshall còn được dùng để phát hiện chu trình âm trong đồ thị. Sau khi chạy thuật toán để tìm đường đi ngắn nhất giữa các cặp đỉnh, ta tiếp tục chạy thuật toán một lần nữa, và nếu đường đi được xem là đường đi ngắn nhất tiếp tục cập nhật ngắn hơn thì có nghĩa rằng tồn tại một chu trình âm trong đồ thị.

Một ứng dụng khác của Floyd-Warshall là tính toán bao đóng truyền ứng (Transitive closure), một khái niệm khá phổ biến trong lý thuyết toán học. Ứng dụng của Transitive closure phổ rộng từ lý thuyết đồ thị, cho tới việc xử lý logic và lý thuyết tính toán, và ngay cả xử lý truy vấn (query processor) trong hệ quản trị cơ sở dữ liệu (Microsoft SQL Server, Oracle và PostgreSQL).

Ngoài ra còn rất nhiều những ứng dụng đa dạng khác của thuật toán Floyd-Warshall trong toán học và khoa học máy tính còn đang cần được chúng ta khám phá.

## Kết luận

Floyd-Warshall là một thuật toán lâu đời, nhưng đã và đang được ứng dụng rất rộng rãi trong Toán học và Khoa học Máy tính. Hy vọng qua bài viết này, mọi người sẽ có cái nhìn trực quan hơn về thuật toán cũng như những ứng dụng của nó trong các lĩnh vực liên quan.

## Tài liệu tham khảo

- <https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm>
- <http://masc.cs.gmu.edu/wiki/FloydWarshall>
- <https://thuytrangcoding.wordpress.com/2018/03/18/graph-shortestpath-floyd/>
- <https://brilliant.org/wiki/floyd-warshall-algorithm/>
