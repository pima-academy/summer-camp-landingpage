---
title: "Luật số lớn và ý nghĩa trong cuộc sống"
date: 2020-07-05
cover: ./cover.jpg
---

Trong bài viết này, chúng ta sẽ tìm hiểu luật số lớn trong xác suất thống kê để đánh giá các sự kiện thường được xem là “có một không hai” hay “cực kỳ may mắn” trong cuộc sống.

Lý thuyết xác suất mô tả kết quả ngẫu nhiên của các phép thử hay thí nghiệm trong thực tế. Đối tượng nghiên cứu chính của xác suất là các biến ngẫu nhiên - bạn đọc có thể hiểu biến ngẫu nhiên là các hàm số liên quan đến phép thử hay thí nghiệm đang xét. Các biến ngẫu nhiên nhận một số giá trị hoặc có miền giá trị với một xác suất nhất định (xác suất của kết quả thí nghiệm cho giá trị đang xét). Giá trị kỳ vọng (expected value) của một biến ngẫu nhiên là giá trị trung bình của nó khi xét tất cả các kết quả có thể.

Ví dụ 1: (các phép thử và biến ngẫu nhiên)

1. Tung một đồng xu hai mặt đều nhau, biến ngẫu nhiên $X = 1$ nếu ra mặt Ngửa và $X = 0$ nếu ra mặt Sấp, giá trị kỳ vọng của $X$ là $\frac{1}{2} \cdot 1 + \frac{1}{2} \cdot 0 = \frac{1}{2}$;
2. Đổ một xí ngầu sáu mặt, biến ngẫu nhiên $Y$ = số ra ở mặt trên cùng của xí ngầu, giá trị kỳ vọng của $Y$ là $\frac{1+2+3+4+5+6}{6} = 3.5$.

Trong lý thuyết xác suất, luật số lớn (law of large numbers) là một định lý mô tả kết quả của việc lặp đi lặp lại phép thử một số lần rất lớn. Cụ thể, luật số lớn nói rằng giá trị trung bình của biến ngẫu nhiên sau khi lặp đi lặp lại phép thử một cách độc lập sẽ ngày càng gần với giá trị kỳ vọng của biến ngẫu nhiên đó.

Ví dụ 2: Một bé thú cưng dự đoán kết quả của 7 trận đấu của đội tuyển Đức và trận chung kết tại giải vô địch bóng đá World Cup 2010, xét biến ngẫu nhiên:

- $T = 1$ nếu bé dự đoán đúng hết các trận.
- $T = 0$ nếu dự đoán sai ít nhất một trận.

Giả sử xác suất dự đoán đúng tất cả các trận là khoảng $1/2^8$ thì giá trị kỳ vọng của $T$ là:

$$
1 \cdot \left(\frac{1}{2}\right)^8 + 0 \cdot \left(1 - \left(\frac{1}{2}\right)^8\right) = \frac{1}{256}.
$$

Theo luật số lớn, nếu có rất nhiều bé thú cưng cùng dự đoán độc lập với nhau thì tỉ lệ số bé đoán đúng khả năng cao sẽ gần với $1/256$. Điều này có nghĩa là gần như chắc chắn có ít nhất một bé dự đoán đúng (vì trung bình số con đoán đúng $= 1/256 > 0$). Như vậy, biết được luật số lớn, ta thấy việc chú bạch tuộc Paul dự đoán đúng 8/8 các trận đấu của đội tuyển Đức ở World Cup 2010 cũng là điều “bình thường” nếu như có rất rất nhiều bạn thú cưng cùng trổ tài dự đoán độc lập với nhau.

Ví dụ 3: Trong các ván bài ở casino hay các kèo cá cược thể thao, do các tham số khác nhau, nhà cái luôn có giá trị kỳ vọng lớn hơn người chơi. Do đó, nếu bạn thắng được vài ván hay đúng vài kèo liên tiếp thì nên dừng lại (thay vì nghĩ là mình đang “số hên” và tiếp tục) bởi nếu trò chơi kéo dài thì theo luật số lớn, bạn gần như chắc chắn sẽ lỗ.

Như vậy, hiểu được luật số lớn không chỉ giúp ta có cái nhìn khách quan hơn về các sự kiện xung quanh mà còn giúp ta đưa ra được nhận định tốt hơn về các quyết định đầu tư và kinh doanh trong cuộc sống.

## Tài liệu tham khảo

- \[1\] <https://en.wikipedia.org/wiki/Law_of_large_numbers>
- \[2\] <https://www.youtube.com/watch?v=MntX3zWNWec>
