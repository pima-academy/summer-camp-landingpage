---
title: "Thuật toán PageRank (kì 1)"
date: 2020-02-28
cover: ./cover.jpg
---

Bạn có biết, cứ mỗi giây trôi qua, có 63000 lệnh tìm kiếm được Google thực hiện. Google đã và đang là một công cụ tìm kiếm phổ biến, chính xác và tiện dụng nhất trên thế giới. Có được thành công như vậy, một phần rất lớn là nhờ vào các thuật toán tìm kiếm, đánh giá và xếp hạng kết quả dựa trên nhiều yếu tố khác nhau. Hôm nay, chúng ta sẽ tìm hiểu thuật toán PageRank, một trong những thuật toán đầu tiên và nổi tiếng nhất được Google dùng để đánh giá độ quan trọng của một trang web, từ đó đưa kết quả tìm kiếm phù hợp cho người dùng.

PageRank được chính hai cha đẻ của Google là Larry Page và Sergey Brin phát triển vào năm 1996 tại đại học Stanford. Tư tưởng chính của PageRank vô cùng đơn giản, theo như Google: “Một trang web càng quan trọng sẽ càng có nhiều liên kết từ các trang khác tới nó”.

Xét trang web A trỏ liên kết đến trang web B, thuật toán PageRank được xây dựng dựa trên hai ý tưởng cơ bản sau:

- Nếu A được xếp hạng cao thì nó phải giúp B có hạng cao hơn.
- Lượng trang mà A trỏ đến nghịch biến với xếp hạng của B, hay nói cách khác, nếu A trỏ đến càng nhiều trang thì giúp tăng thứ hạng càng ít.

Ta kí hiệu những trang web bởi $P_1, P_2, P_3, \ldots$ và nếu trang $P_j$ trỏ liên kết đến trang $P_i$ thì ta kí hiệu $j \to i$. Gọi $l_j$ là tổng số liên kết phát ra từ trang $P_j$. Ta định nghĩa trọng lượng $\mu_i$ của trang $P_i$ bằng công thức hồi quy:

$$
\mu_i = \sum_{j \to i} \frac{\mu_j}{l_j} \tag{1}
$$

Xét mô hình đơn giản với 4 trang web sau (xem mô hình 2 ở hình đầu bài). Ta có:

$$
\begin{aligned}
\mu_1 &= \tfrac{1}{2}\mu_2 + \tfrac{1}{2}\mu_3 + \tfrac{1}{2}\mu_4 \\
\mu_2 &= \tfrac{1}{3}\mu_1 + \tfrac{1}{2}\mu_4 \\
\mu_3 &= \tfrac{1}{3}\mu_1 + \tfrac{1}{2}\mu_2 \\
\mu_4 &= \tfrac{1}{3}\mu_1 + \tfrac{1}{2}\mu_3
\end{aligned} \tag{3}
$$

Dễ dàng giải được hệ trên với kết quả $(\mu_1, \mu_2, \mu_3, \mu_4) = (3, 2, 2, 2)$. Vậy trang $P_1$ có trọng lượng cao nhất.

Một vấn đề đặt ra là trong thực tế, số trang web là rất lớn, việc giải hệ phương trình tuyến tính với hàng tỉ trang là điều không thể ngay cả với máy tính. Phải chăng tồn tại một công cụ có thể giải quyết bài toán trong trường hợp tổng quát với $n$ trang bất kì? Ở [kì sau](/blog/thuat-toan-pagerank-ki-2/), chúng ta sẽ tiếp tục làm rõ vấn đề này.
