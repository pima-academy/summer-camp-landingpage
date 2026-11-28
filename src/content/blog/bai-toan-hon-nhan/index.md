---
title: "Bài toán hôn nhân"
date: 2022-01-23
cover: ./cover.jpg
---

Chưa đến 10 ngày nữa thôi, chúng ta sẽ chào đón một năm mới. Trong không khí ấm cúng của sự đoàn viên, vui tươi của những cuộc gặp gỡ đầu năm mới, chắc chắn chúng ta, những người trẻ sẽ thường xuyên được hỏi khi nào thì “cưới vợ”, “có bồ”. Thường lời khuyên được đưa ra là học cách ăn nói, tán tỉnh hay “thả thính”, nhưng đối với những người trong ngành STEM gắn với hình mẫu khô khan, cứng nhắc thì phải làm thế nào để tìm người hợp với mình, chả lẽ chúng ta phải ở giá như Newton sao?

Câu hỏi vui tưởng chừng như vô thưởng vô phạt này lại có thể mở rộng cho nhiều vấn đề liên quan đến đưa ra quyết định trong cuộc sống, trong đó có một định lý đẹp của tổ hợp, và một thuật toán khá nổi tiếng cho bài toán này.

Giả sử ta có bài toán như sau, $n$ người đàn ông và $n$ người phụ nữ, mỗi người đều muốn tìm ý trung nhân của mình, mỗi người phụ nữ có danh sách những người mà cô yêu thích (cho rằng những người này đều là dị tính luyến ái). Làm cách nào để tìm một phép ghép đôi mà ở đó mọi người phụ nữ đều thực sự yêu nửa kia của mình?

Trong trường hợp này, theo định lý hôn nhân của Hall, phép ghép đôi này chỉ có thể tồn tại khi mà điều kiện hôn nhân được đảm bảo. Cụ thể, định lý Hall được phát biểu như sau:

> Cho $S$ là một họ hữu hạn các tập hữu hạn (finite family of finite sets). Nếu với mỗi nhóm con $R$ gồm các tập của $S$, số tập trong $R$ nhỏ hơn hoặc bằng số phần tử của tập là hợp của các tập này:
>
> $$
> |R| \le \left| \bigcup_{X \in R} X \right|.
> $$
>
> Khi đó từ mỗi tập thuộc $S$ ta có thể chọn một đại diện sao cho hai tập khác nhau thì có hai đại diện khác nhau. Tập hợp các đại diện này được gọi là $T$ (system of distinct representatives).

Ví dụ ta có một nhóm với mỗi tập là danh sách yêu thích của từng người phụ nữ sau $S = \{\{1,2,3\}, \{1,3\}, \{3\}\}$, thì ta có thể chọn $T$ như sau: chọn 2 từ tập đầu tiên, 1 từ tập thứ hai, 3 từ tập thứ ba. Nếu chọn 1 từ tập đầu tiên, 3 từ tập thứ hai, thì ta không thể hình thành một tập $T$ thỏa mãn được.

Diễn giải lại điều kiện hôn nhân ta có thể hiểu, với mọi nhóm người phụ nữ nếu mà số người đàn ông được yêu thích bởi ít nhất một người phụ nữ lớn hơn hoặc bằng số người phụ nữ, thì có thể tìm một phép ghép sao cho ta có mối quan hệ phù hợp mà ở đó cả người đàn ông và phụ nữ đều thoả mãn với đối tác của mình (perfect matching).

Khi mở rộng bài toán này ra với điều kiện mỗi người đều có một danh sách có thứ tự gồm người mà mình yêu thích và người đàn ông sẽ chủ động tỏ tình với người phụ nữ, ta sẽ có một nhánh bài toán mới, được gọi là bài toán hôn nhân bền vững (stable-marriage problem). Bài toán này có tính ứng dụng rất lớn, và nó cũng có một thuật toán rất đẹp để tìm một ghép đôi ổn định cho các cặp vợ chồng - thuật toán Gale – Shapley. Thuật toán này cũng đã đem lại giải Nobel kinh tế cho người đã tìm ra nó.

Thuật toán này xử lý bài toán khi mà cả người đàn ông và người phụ nữ đều có một danh sách yêu thích của bản thân và không tồn tại hai người khác giới nào mà cả hai người đều yêu thích nhau nhiều hơn người bạn đời hiện tại của họ.

## Tài liệu tham khảo

- [Gale – Shapley Algorithm](https://en.wikipedia.org/wiki/Gale%E2%80%93Shapley_algorithm), Wikipedia.
- [Hall’s Marriage Theorem](https://brilliant.org/wiki/hall-marriage-theorem/), Brilliant.org.
- Lấy người mình yêu và định lý Birkhoff, Vuhavan Blog.
- Lý thuyết cầu hôn hay Lấy người mình yêu và không bỏ được, tập 2, Vuhavan Blog.
- Gale-Shapley Algorithm, Samuel Whitehouse, Youtube.
