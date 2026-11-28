---
title: "Xác suất có điều kiện và các thống kê thiên vị"
date: 2020-07-04
cover: ./cover.jpg
---

Lý thuyết xác suất mô tả kết quả ngẫu nhiên của các phép thử hay thí nghiệm trong thực tế cuộc sống. Thống kê hiểu nôm na là thu thập dữ liệu thực tế để ước lượng tốt hơn các tham số của mô hình xác suất đang xem xét. Xác suất và thống kê không chỉ là nền tảng của khoa học dữ liệu mà còn vô cùng quan trọng trong nhiều vấn đề khác của xã hội. Trong bài viết này, chúng ta sẽ xem xét việc sử dụng thống kê đánh giá xu hướng (xác suất) lựa chọn của một nhóm người thông qua xác suất có điều kiện.

Ví dụ 1: Một lớp học có 100 học sinh tổ chức bầu chọn lớp trưởng. Lớp có hai tổ C và D và hai tổ trưởng là hai ứng cử viên duy nhất. Giả sử lớp có 50 bạn thuộc tổ C và 50 bạn thuộc tổ D; tổ C có 35 bạn ủng hộ Trung và 15 bạn ủng hộ Bi; tổ D có 20 bạn ủng hộ Trung và 30 bạn ủng hộ Bi.

|      | Trung | Bi  |
| ---- | ----: | --: |
| Tổ C |    35 |  15 |
| Tổ D |    20 |  30 |

Trong thực tế, chúng ta thường không biết con số cụ thể bạn nào ủng hộ ai (hình thức bỏ phiếu kín để đảm bảo công bằng) và tiến hành khảo sát trên mạng xã hội để dự đoán các con số này. Đây là một phép thử ngẫu nhiên và ta có thể đặt các kết quả tương ứng:

1. $T$ là sự kiện bạn ủng hộ Trung;
2. $B$ là sự kiện bạn ủng hộ Bi;
3. $C$ là sự kiện bạn thuộc tổ C;
4. $D$ là sự kiện bạn thuộc tổ D.

Từ con số thực tế ở bảng trên, ta sẽ có được các xác suất không có điều kiện sau:

$$
\begin{aligned}
& P(C) = P(D) = 50/100 = 50\%, \\
& P(T) = 55/100 = 55\%, \quad P(B) = 45/100 = 45\%, && (1) \\
& P(BD) = 30/100 = 30\%.
\end{aligned}
$$

($P(BD)$ là xác suất bạn vừa ủng hộ Bi vừa thuộc tổ D.)

Xác suất bạn học sinh ủng hộ Bi có điều kiện bạn thuộc tổ D, ký hiệu là $P(B \mid D)$, được tính bởi công thức:

$$
P(B \mid D) = \frac{P(BD)}{P(D)} = \frac{30}{50} = 60\%. \tag{2}
$$

Từ (1), ta có thể thấy kết quả của cuộc khảo sát nên là Trung sẽ thắng với tỉ lệ gần với con số thực tế 55%. Tuy nhiên, giả sử các bạn tổ C không thích dùng mạng xã hội nên chỉ có một số các bạn tổ D điền khảo sát. Khi đó, khả năng cao con số ta khảo sát được sẽ gần với 30/50 = 60% người ủng hộ Bi - đây chính là xác suất có điều kiện tính ở (2). Điều này sẽ dẫn đến một dự đoán không chính xác (thiên vị) về kết quả của cuộc bầu cử.

Nắm được lý thuyết xác suất có điều kiện không chỉ giúp ta tránh được các kết luận thiên vị mà còn giúp ta ước lượng được chính xác hơn xác suất cần tìm. Chẳng hạn, ta có công thức tính xác suất không có điều kiện (thường được gọi là công thức Bayes) từ xác suất có điều kiện trong Ví dụ 1 như sau:

$$
P(B) = P(B \mid C)\,P(C) + P(B \mid D)\,P(D).
$$

Như vậy, kể cả khi các bạn tổ C không tham gia khảo sát, ta vẫn có được $P(C)$ và $P(D)$ và có thể xấp xỉ $P(B \mid C)$ trong công thức trên bằng dữ liệu từ các cuộc bầu cử trước.

Hiện nay, rất nhiều các phương tiện truyền thông và mạng xã hội sử dụng phương pháp khảo sát thống kê và đưa ra kết luận mà quên mất đối tượng bầu chọn có điều kiện là độc giả/người dùng của họ từ trước. Điều này dẫn đến nhiều dự đoán hoặc kết quả thiên vị và nguy hiểm hơn là tạo ra một ảo giác không đúng về thực tế cuộc sống. Một ví dụ khác là cầu thủ Việt Nam thường thắng áp đảo các hạng mục bầu chọn qua mạng xã hội tại các giải đấu ở Châu Á.

## Tài liệu tham khảo

- \[1\] <https://en.wikipedia.org/wiki/Conditional_probability>
- \[2\] <https://en.wikipedia.org/wiki/Bayes%27_theorem>
- \[3\] How Not to Be Wrong: The Power of Mathematical Thinking - Jordan Ellenberg
