---
title: "Thuật toán PageRank (kì cuối)"
date: 2020-03-12
cover: ./cover.jpg
---

Ở [kì trước](/blog/thuat-toan-pagerank-ki-2/), ta đã tìm hiểu một phương pháp để tìm vector trọng lượng các trang web dựa trên phương diện xác suất, đó là tìm phân bố dừng của xích Markov. Tuy nhiên, có thể gặp một vấn đề là người lướt web không thể thoát ra khỏi trang web hiện tại (do không có liên kết đến trang nào khác). Nhằm khắc phục vấn đề trên, thuật toán PageRank điều chỉnh ý tưởng ban đầu bằng cách thêm một tham số $c$ ($0 \le c \le 1$) - damping factor:

$$
p'_i = \frac{c}{n} + \sum_{j \to i} \frac{1 - c}{l_j} p_j \tag{1}
$$

Mô hình mới có thể được diễn giải như sau: Người lướt web đi ngẫu nhiên trên những trang ban đầu, tuy nhiên lúc sau, có thể do chán (hoặc muốn thoát khỏi “hố đen”), lại đột ngột nhảy sang một trang khác không liên quan gì đến trang lúc đầu. Xác suất bỏ trang hiện tại là $c$, và bắt đầu lại bằng cách chọn một trang bất kì trong $n$ trang cho trước, xác suất để bắt đầu lại ở mỗi trang là như nhau.

Khi đó, trọng lượng của trang được tính bởi công thức

$$
\mu_i = \frac{c}{n} + \sum_{j \to i} \frac{1 - c}{l_j} \mu_j \tag{2}
$$

Khi $c = 0$, ta nhận được mô hình trước đó. Khi $0 < c \le 1$ thì $1/c$ chính là số trang trung bình mà người lướt web đã đi qua. Ví dụ việc chọn $c = 0.2$ tương ứng với việc người đó đã đi trung bình 5 liên kết. Bạn có thể dễ dàng cài đặt thuật toán PageRank bằng phương pháp truyền thống (dùng các thư viện đại số tuyến tính) hoặc Power iteration để tiết kiệm bộ nhớ:

- Khởi tạo một vector phân bố $P(0)$ bất kì.
- Tính ma trận $M$.
- Lặp đến khi hội tụ: $\mu = M\mu$.

Thuật toán PageRank không chỉ dùng cho các bộ tìm kiếm mà còn được sử dụng rộng rãi trong các bài toán Graph Mining như sinh học, hóa học, các bài toán khoa học xã hội, vật lý, …

## Tài liệu tham khảo

- \[1\] <https://thetalog.com/machine-learning/page-rank/>
- \[2\] <https://images.math.cnrs.fr/Comment-Google-classe-les-pages.html>
- \[3\] Tạp chí Pi
