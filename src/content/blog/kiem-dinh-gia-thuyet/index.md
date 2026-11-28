---
title: "Kiểm định giả thuyết"
date: 2020-01-08
cover: ./cover.jpg
---

Chuỗi cửa hàng cà phê PiMA sau khi ra mắt sản phẩm đầu tiên rất thành công với 70% phản hồi tích cực từ tất cả khách hàng. Ông chủ muốn tiếp tục cho ra mắt công thức pha chế tiếp theo và hy vọng cũng nhận được sự thành công như lần trước. Ông chủ đã ngầm khẳng định giả thuyết rằng 70% tất cả khách hàng sẽ yêu thích sản phẩm mới này và tiến hành khảo sát để kiểm chứng. Ông cho bán miễn phí trên 100 khách hàng bất kỳ và ghi nhận được 67 người cho kết quả tích cực. Với kết quả như trên, ông chủ hơi nghi ngờ về giả thuyết của mình. Nếu kết quả càng xa con số 70%, sự nghi ngờ của ông chủ càng lớn và đến một ngưỡng nào đó ông chủ sẽ phải bác bỏ giả thuyết của mình. Liệu có cách nào để cụ thể hóa mối tương quan giữa kết quả khảo sát và kết luận của ta về giả thuyết hay không? Câu trả lời là có! Trong bài viết này, chúng ta sẽ đến với khái niệm "Kiểm định giả thuyết" (Hypothesis Testing).

Quá trình mà ông chủ có thể thực hiện được gọi là "Kiểm định giả thuyết" (Hypothesis Testing), một khái niệm có liên hệ mật thiết với khái niệm [Khoảng tin cậy](/blog/khoang-tin-cay/) mà chúng ta đã tìm hiểu kỳ trước. Kiểm định giả thuyết thường xuất hiện khi ta cần phải đưa ra kết luận về 2 giả thuyết trái ngược nhau thông qua việc khảo sát. Với ví dụ trên, ta có 2 giả thuyết như sau:

- $H_0$: Phần trăm khách hàng yêu thích sản phẩm là 70% (gọi là null hypothesis, được giả sử là đúng).
- $H_1$: Phần trăm khách hàng yêu thích sản phẩm không bằng 70% (gọi là alternative hypothesis, được giả sử là sai).

Và cũng có 2 quyết định mà ta phải lựa chọn:

- Không bác bỏ $H_0$.
- Bác bỏ $H_0$ (ủng hộ $H_1$).

Khoảng giá trị để ta không bác bỏ $H_0$ được gọi là vùng chấp nhận (acceptance region). Ví dụ nếu kết quả khảo sát nằm trong khoảng 65% đến 75% (vùng chấp nhận) thì ta không bác bỏ $H_0$, ngược lại ta sẽ bác bỏ. Việc xác định vùng chấp nhận rất giống với quá trình tìm Khoảng tin cậy và vì thế cũng sẽ tồn tại sự không chắc chắn.

Ở trên là 2 giả thuyết về toàn bộ khách hàng và ta chỉ biết được chính xác tính đúng sai khi ta khảo sát hết tất cả những khách hàng đó. Tuy nhiên ta lại chỉ được khảo sát trên 100 người (một tập con của toàn bộ khách hàng) nên vì thế kết luận về các giả thuyết sẽ không chắc chắn. Nhìn chung ta có 2 loại kết luận sai như sau:

- Type 1 error: Bác bỏ $H_0$ khi thực sự $H_0$ đúng.
- Type 2 error: Không bác bỏ $H_0$ khi thực sự $H_0$ sai.

Trong thực tế, người ta có thể kiểm soát xác suất để xảy ra type 1 error theo ý muốn (thông qua cách thiết kế thí nghiệm, điều chỉnh các thông số,…). Type 1 error càng thấp thường đòi hỏi kết quả khảo sát phải cách xa giả thuyết hơn thì mới bị bác bỏ. Do đó, nếu ta điều chỉnh xác suất của type 1 error ở mức thấp, ta có thể tự tin hơn khi khảo sát cho kết quả bác bỏ $H_0$.

Sẽ có bạn đọc thắc mắc, chuyện gì xảy ra nếu mình thay đổi cách đặt $H_0$ và $H_1$? Thử xét 2 trường hợp thú vị như sau:

TH1:

- $H_0$: Người đàn ông không là hung thủ.
- $H_1$: Người đàn ông là hung thủ.

TH2:

- $H_0$: Người đàn ông là hung thủ.
- $H_1$: Người đàn ông không là hung thủ.

Trong trường hợp 1, ta chỉ kết luận người đàn ông có tội khi bác bỏ được $H_0$, tức là tìm được bằng chứng phạm tội. Nếu không tìm được bằng chứng, ta không thể biết chắc được người đó có tội hay không nên sẽ thả tự do cho người đó. Còn trong trường hợp 2, người đàn ông sẽ được thả khi tìm được bằng chứng ngoại phạm và bác bỏ $H_0$. Nhưng nếu không tìm được bằng chứng ngoại phạm, ta không biết chắc được người đàn ông có tội hay không nên sẽ bắt tội người đó.

Ta thấy rằng cách đặt của trường hợp 2 đã khắt khe với người đàn ông hơn cách đặt của trường hợp 1. Hay nói cách khác, chủ nghĩa của trường hợp 2 là “thà giết nhầm còn hơn bỏ sót”, trong khi ở trường hợp 1 là “thà bỏ sót còn hơn giết nhầm”.

## Tài liệu tham khảo

- Montgomery, Douglas C, and George C Runger. Applied Statistics and Probability for Engineers. Wiley, 2019.
