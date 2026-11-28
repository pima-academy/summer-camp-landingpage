---
title: "Ăn tiền của bà"
date: 2020-04-07
cover: ./cover.jpg
---

Bà của bạn A là một người rất hào phóng và thích cho con cháu tiền tiêu vặt. Nhưng bà cũng thích những câu đố hóc búa và tin rằng những lựa chọn khó khăn sẽ giúp A trân trọng hơn với những đồng tiền bà cho. Lần này, sau khi đọc những bài viết về xác suất trên fanpage PiMA, bà nảy ra ý tưởng mới. Một sáng đẹp trời, bà gọi A đến và đưa ra trước mặt một phong bì màu đỏ và một phong bì màu xanh. “Cháu được chọn 1 phong bì, mở ra xem số tiền bên trong, sau đó quyết định giữ phong bì đó hoặc đổi và giữ phong bì còn lại.” - bà bảo. Giả sử 1 trong 2 phong bì có nhiều tiền hơn phong bì còn lại, A nên chọn thế nào để có nhiều tiền ăn vặt nhất?

Chiến thuật đơn giản nhất mà A nghĩ ra, là lúc nào cũng chọn phong bì màu đỏ để mở ra rồi giữ luôn vì đó là màu ưa thích của A. “Nhưng lỡ may bà biết A thích màu đỏ, nên để nhiều tiền hơn vào phong bì màu xanh thì sao nhỉ?” - A đắn đo. Tương tự, nếu chiến thuật của A là lúc nào cũng chọn phong bì màu xanh, thì A vẫn phải suy nghĩ về việc bà cố tình để nhiều tiền hơn vào phong bì màu đỏ để A chọn đúng màu mình thích mà được nhiều tiền. Cách đánh giá chiến thuật này được gọi là adversarial argument, dùng phổ biến trong các đánh giá tình huống xấu nhất.

Để có chiến thuật tốt ngay trong những tình huống xấu nhất, A biết mình không nên dùng một chiến thuật dễ đoán như trên, mà nên dùng một chiến thuật ngẫu nhiên (randomized) và đánh giá ngẫu nhiên. Chiến thuật ngẫu nhiên đơn giản nhất mà A nghĩ ra là “Mình tung đồng xu, mặt sấp thì lấy phong bì đỏ rồi giữ luôn, mặt ngửa thì lấy phong bì xanh.” Với chiến thuật này, ngay cả trong trường hợp xấu nhất, hay ngay cả khi bà sở hữu cỗ máy thời gian của Đô-rê-mon để biết trước chiến thuật của A, thì xác suất lấy được phong bì có nhiều tiền hơn là 50%.

Hài lòng với chiến thuật này, A cầm đồng xu lên chuẩn bị tung thì thấy bà cười bí ẩn. “Chẳng lẽ có cách nào để được phong bì nhiều tiền hơn với xác suất trên 50%?” - A nghĩ, “Có cách nào để sử dụng thông tin số tiền trong một phong bì?”. Điều này tưởng như không thể, vì A đâu có thông tin gì về phong bì còn lại!

Vò đầu bứt tóc cả ngày, A quyết định dùng quyền trợ giúp gọi điện thoại cho B - đứa bạn chăm chỉ không ngủ gật trong giờ xác suất thống kê. Nghe xong câu chuyện, B đáp: “Có cách, cứ làm thế này:

- Bước 1: Tung đồng xu để chọn ngẫu nhiên 1 phong bì rồi mở ra, ghi lại số tiền trong đó là $a$.
- Bước 2: Chọn ngẫu nhiên (sample) một số $z$ từ phân phối chuẩn tắc (standard normal distribution), nếu $z < a$ thì giữ phong bì vừa mở, còn nếu không thì đổi và giữ phong bì còn lại.”

A lấy làm lạ với chiến thuật của B. Tại sao có xuất hiện phân phối chuẩn tắc? Tại sao lựa chọn phong bì dựa trên số $z$ - một con số không liên quan gì đến số tiền trong hai chiếc phong bì? Như một nhà toán học đích thực, A quyết định không áp dụng mù quáng chiến thuật của B mà tính xác suất nhận được phong bì cao hơn cho ra lẽ. Để làm điều này, A cần định nghĩa một số ký hiệu toán học.

Gọi $Q$ là hàm phân phối tích lũy (cumulative distribution function - cdf) của phân phối chuẩn tắc. Gọi số tiền trong 2 phong bì là $x_1$ và $x_2$. Không mất tính tổng quát, chúng ta giả sử $x_2 > x_1$. Chúng ta cùng A chia trường hợp để tính xác suất lấy được phong bì nhiều tiền hơn.

**Trường hợp 1:** $z < x_1$ (và do $x_1 < x_2$ theo giả định, chúng ta có luôn $z < x_1 < x_2$).

Trường hợp này xảy ra với xác suất $Q(x_1)$ do chúng ta biết phân phối của $z$. Do $z$ bé hơn cả $x_1$ và $x_2$, chúng ta biết chắc chắn $z < a$ mà không cần quan tâm phong bì mở ra ở bước 1 là phong bì nào. Do $z < a$, theo bước 2 của chiến thuật, chúng ta giữ bất cứ phong bì nào chúng ta mở ra ở bước một. Nói cách khác, nếu $z$ rơi vào trường hợp này thì không khác gì chiến thuật chúng ta tung đồng xu để chọn một trong hai phong bì rồi giữ luôn phong bì đó. Như phân tích bên trên, xác suất chọn được phong bì nhiều tiền hơn là 50% theo chiến thuật này.

**Trường hợp 2:** $x_2 < z$ (và do $x_1 < x_2$ theo giả định, chúng ta có $x_1 < x_2 < z$).

Trường hợp này xảy ra với xác suất $1 - Q(x_2)$. Phân tích giống hệt như trường hợp 1, nếu $z$ rơi vào trường hợp này thì không khác gì chiến thuật chúng ta tung đồng xu để chọn một trong hai phong bì rồi đổi và giữ phong bì còn lại. Xác suất chọn được phong bì nhiều tiền hơn ở đây lại là 50%.

**Trường hợp 3:** $x_1 < z < x_2$.

Trường hợp này xảy ra với xác suất $Q(x_2) - Q(x_1)$. Trong trường hợp này, giá trị của $a$ sẽ làm thay đổi lựa chọn của chúng ta. Nếu $a = x_2$, chúng ta có $z < x_2$ (giả định của trường hợp 3) và do đó $z < a$. Theo chiến thuật ở bước 2, chúng ta quyết định giữ phong bì chọn ở bước một. Nhưng $a = x_2$ đồng nghĩa với việc phong bì chọn ở bước một là phong bì có nhiều tiền hơn. Do đó, nếu $a = x_2$ thì chúng ta chọn được phong bì có nhiều tiền hơn với xác suất 100%.

Ngược lại, nếu $a = x_1$, chúng ta có $x_1 < z$ (giả định của trường hợp 3) và do đó $a < z$. Theo bước 2, chúng ta quyết định đổi phong bì. Nhưng $a = x_1$ đồng nghĩa với việc phong bì chọn ở bước một có ít tiền hơn. Do đó, đổi phong bì là quyết định đúng và với xác suất 100% chúng ta lại chọn phong bì có nhiều tiền.

Do đó trong trường hợp 3 này, chiến thuật của B giúp A chọn được phong bì có nhiều tiền hơn với xác suất 100%.

**Tổng hợp lại**, nếu $z$ nằm trong $[x_1, x_2]$ thì chúng ta chọn phong bì nhiều tiền hơn với xác suất 100%, nếu $z$ nằm ngoài khoảng đó thì xác suất là 50%. Do đó, xác suất chọn phong bì nhiều tiền hơn là:

$$
50\% \cdot Q(x_1) + 50\% \cdot (1 - Q(x_2)) + 100\% \cdot (Q(x_2) - Q(x_1)) = 50\% + 50\% \cdot (Q(x_2) - Q(x_1))
$$

Do $Q$ là cdf của phân phối chuẩn tắc, $Q(x_2) - Q(x_1) > 0$ và chúng ta kết luận là A chọn đúng với xác suất $> 50\%$.

A rút ra được một số nhận xét từ phân tích trên như sau:

1. $z$ không nhất thiết phải được chọn từ phân phối chuẩn tắc. Trong toàn bộ phân tích, tính chất của phân phối chuẩn tắc chỉ được áp dụng ở đoạn “$Q(x_2) - Q(x_1) > 0$”. Do đó, bất kì phân phối nào có cdf $F$ thoả $F(y_2) - F(y_1) > 0$ với mọi khoảng $[y_1, y_2]$ đều có thể được dùng để chọn $z$.
2. $z$ phải không phụ thuộc vào việc tung đồng xu ở bước 1: mọi phân tích trong các trường hợp đều phụ thuộc vào điều kiện này.
3. Chiến thuật này có thể tổng quát hoá cho trường hợp $x_1$ và $x_2$ (số tiền thật trong 2 phong bì) là các biến ngẫu nhiên với điều kiện $x_1 > x_2$ với xác suất 1.
4. Nếu giữ nguyên $x_1$ hoặc $x_2$ thì $x_2 - x_1$ càng lớn thì xác suất chọn phong bì nhiều tiền hơn càng cao.

Hài lòng với phân tích này, A cảm ơn B rối rít và áp dụng ngay chiến thuật của B. A tung đồng xu rồi chọn $z$ và lấy phong bì theo chiến thuật, nhưng tiếc thay A vẫn chọn phải phong bì ít tiền hơn. Hoá ra, một phong bì chứa 50000 đồng và phong bì còn lại chứa 30000 đồng, do đó xác suất chọn phong bì chứa 50000 đồng là:

$$
50\% < 50\% + 50\% \cdot (Q(50000) - Q(30000)) < 50.0000\ldots01\%
$$

(xấp xỉ hàng trăm triệu số 0).

## Cách tính “xấp xỉ hàng trăm triệu số 0”

$$
Q(y) - Q(x) = \text{constant} \cdot \int_x^y e^{-t^2/2}\, dt < \text{constant} \cdot e^{-x^2/2} \cdot (y - x)
$$

Trong đó $e^{x^2/2} \gg (y - x)$ và $\log \dfrac{1}{Q(y) - Q(x)} \approx \log e^{x^2/2} = x^2/2$.

## Tài liệu tham khảo

- Problem from Tsitsiklis, Bertsekas, Introduction to Probability, 2nd edition.
- (variant of) <https://en.wikipedia.org/wiki/Two_envelopes_problem>
- (variant of) <https://en.wikipedia.org/wiki/Secretary_problem>
