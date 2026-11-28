---
title: "Khoảng tin cậy"
date: 2019-10-25
cover: ./cover.jpg
---

Một chuỗi cửa hàng cà phê nọ muốn áp dụng công thức pha chế mới vào một sản phẩm của họ. Nhưng trước khi ra mắt chính thức, họ muốn tìm hiểu mức độ hài lòng của khách hàng đối với loại sản phẩm này bằng cách chạy một chiến dịch bán miễn phí cho 100 khách hàng bất kỳ và khảo sát. Kết quả có 70% người được khảo sát cho kết quả tích cực. Câu hỏi được đặt ra là sau khi mở bán chính thức, phần trăm người yêu thích công thức này sẽ chênh lệch bao nhiêu so với khoảng 70%?

Trên thực tế, chúng ta sẽ hy vọng con số sẽ dao động một khoảng nhỏ quanh giá trị 70%. Vậy sẽ đáng "tin cậy" hơn nếu ta sử dụng một khoảng giá trị để đánh giá thay vì chỉ sử dụng một giá trị duy nhất. Ta cần một cách biểu diễn cụ thể hơn, dự đoán được khoảng dao động của giá trị, đồng thời cũng đưa ra được một đại lượng để đánh giá khoảng giá trị đó. Điều này dẫn ta đến khái niệm về độ tin cậy và khoảng tin cậy. Ví dụ nếu ta lặp lại khảo sát như trên nhiều lần thì 90% (độ tin cậy) kết quả sẽ rơi vào khoảng 62,44% đến 77,56% (khoảng tin cậy). Với ví dụ trên, ta có thể tạm hiểu độ tin cậy là mức độ tự tin mà con số thực tế sẽ nằm trong khoảng tin cậy mà ta đã xác định.

Tới đây các bạn đọc có thể đoán ra được độ rộng của khoảng tin cậy sẽ liên hệ với độ tin cậy. Chọn độ tin cậy lớn sẽ yêu cầu một khoảng tin cậy rộng hơn (để bao phủ nhiều giá trị hơn), độ tin cậy thấp thì khoảng tin cậy cũng có xu hướng hẹp đi.

Trên thực tế, người ta thường xác định độ tin cậy mong muốn trước khi xác định khoảng tin cậy phù hợp. Dưới đây là một số yếu tố ảnh hưởng đến việc xác định khoảng tin cậy.

Trong khảo sát trên, 70% trong tổng số 100 khách hàng yêu thích sản phẩm mới. Nhưng nếu từ đầu ta khảo sát trên 1000 khách hàng và cũng thu được kết quả 70% thì sao? Khảo sát trên 1000 người sẽ phản ánh thực tế tốt hơn so với khảo sát trên 100 người nên ta có thể hiểu tăng số người khảo sát sẽ giúp ta đạt được độ tin cậy cao mà vẫn giữ cho khoảng tin cậy không quá lớn.

Tính phân tán của kết quả khảo sát cũng sẽ ảnh hưởng đến quá trình xác định khoảng tin cậy. Nếu như ta thực hiện khảo sát nhiều lần, mỗi lần khảo sát trên 100 người bất kỳ và kết quả thu được mỗi lần đều rất khác nhau thì cũng rất khó để đảm bảo con số thực chỉ dao động một vùng nhỏ quanh giá trị 70% được. Dẫn đến với cùng một độ tin cậy cho trước, dữ liệu ổn định sẽ yêu cầu khoảng tin cậy hẹp hơn. Sự phân tán này được đo lường bằng đại lượng có tên độ lệch chuẩn (standard deviation).

Với trường hợp trên, công thức gãy gọn dùng để xấp xỉ khoảng tin cậy với một độ tin cậy nhất định được tính theo công thức sau (xem thêm hình đầu bài):

$$
\hat{p} - z\sqrt{\frac{\hat{p}(1 - \hat{p})}{n}} \le p \le \hat{p} + z\sqrt{\frac{\hat{p}(1 - \hat{p})}{n}}.
$$

Trong đó $\hat{p}$ là giá trị khảo sát (70%), $n$ là số người được khảo sát (100 người) và $z$ (phụ thuộc vào phân phối được giả sử của dữ liệu) được xác định theo độ tin cậy như bảng sau:

| Độ tin cậy | 90%  | 95%  | 99%  |
| ---------- | ---- | ---- | ---- |
| $z$        | 1.65 | 1.96 | 2.58 |

Vậy đối với bài toán ở trên, để thu được độ tin cậy 90% thì khoảng tin cậy tương ứng là: 62,44% - 77,56%. Lưu ý, công thức trên mặc dù thỏa mãn sự phụ thuộc của độ tin cậy vào các yếu tố, nhưng cũng phải cần thêm một số ràng buộc nữa mới có thể sử dụng.

## Tài liệu tham khảo

- Montgomery, Douglas C, and George C Runger. Applied Statistics and Probability for Engineers. Wiley, 2019.
