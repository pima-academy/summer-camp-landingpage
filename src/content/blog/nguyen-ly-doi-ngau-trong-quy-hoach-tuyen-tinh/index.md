---
title: "Nguyên lý đối ngẫu trong quy hoạch tuyến tính"
date: 2024-07-18
cover: ./cover.jpg
---

Đối ngẫu là một nguyên lý quan trọng trong tối ưu hóa nói chung và tối ưu hóa tuyến tính nói riêng. Dựa trên tính đối ngẫu, ta có thể xem xét một bài toán quy hoạch tuyến tính dưới hai khía cạnh: bài toán gốc và bài toán đối ngẫu của nó. Từ đó có thêm thông tin và hướng giải quyết cho vấn đề tối ưu ban đầu. Trong bài viết này, chúng ta sẽ cùng đi qua sơ lược cách một bài toán đối ngẫu được hình thành thông qua một tình huống thuận mua vừa bán giữa hai người nông dân.

Chắc hẳn bạn đọc vẫn còn nhớ đến bài toán tối ưu mà anh Việt đã gặp phải (mời bạn tìm đọc lại bài viết về thuật toán đơn hình trên page). Ta có thể tóm tắt bài toán của anh Việt ngắn gọn như trong hình đầu bài.

Trong đó, để sản xuất được một tấn lúa, ngô, lạc cần lần lượt 3, 4, 2 hectares đất; 400, 100, 200 kilograms phân bón; 200, 300, 100 tấn nước và anh Việt có thể sử dụng tối đa 8 ha đất, 1.1 tấn phân bón, 500 tấn nước mà mình đang có. Giá bán của mỗi 1 tấn lúa, 1 tấn ngô và 1 tấn lạc lần lượt là 5, 4 và 3 triệu đồng. Bài toán đặt ra là anh Việt cần phải tìm ra một phương án cho việc trồng bao nhiêu tấn lúa, ngô và lạc sao cho doanh thu từ việc bán nông sản là lớn nhất. Trong kỳ trước, anh Việt đã sử dụng những phép thế rất đơn giản để tìm ra lời giải tối ưu nhất cho vấn đề của mình. Cụ thể, nếu anh Việt trồng 2 tấn lúa, 1 tấn lạc và không trồng ngô thì sẽ được doanh thu lớn nhất là 13 triệu VND.

![Bài toán của anh Việt: tối đa 5x + 4y + 3z với các ràng buộc 3x + 4y + 2z ≤ 8, 4x + y + 2z ≤ 11, 2x + 3y + z ≤ 5, x, y, z ≥ 0; và bài toán của anh Quân: tối thiểu 8a + 11b + 5c với các ràng buộc 3a + 4b + 2c ≥ 5, 4a + b + 3c ≥ 4, 2a + 2b + c ≥ 3, a, b, c ≥ 0](./hinh-1.jpg)

Cũng trên vùng đồng bằng đó, một anh nông dân khác từ Bạc Liêu tên Quân muốn mua lại toàn bộ số đất, phân bón và nước mà anh Việt đang có với mức giá lần lượt là $a$, $b$ và $c$ (triệu VND) cho mỗi một hectare đất, một tấn phân bón và một tấn nước.

Sau một hồi thương lượng, anh Việt đồng ý bán toàn bộ đất trồng, phân bón và lượng nước của mình cho anh Quân với điều kiện số tiền anh Việt nhận lại được do bán các “nguyên liệu” để sản xuất một tấn lúa, ngô và lạc lần lượt không thấp hơn 5, 4, 3 triệu đồng. Điều này là hợp lý. Đơn cử, thay vì bán 3 ha đất, 400 kg phân bón và 200 tấn nước với giá thấp hơn 5 triệu VND, anh Việt có thể sử dụng lượng “nguyên liệu” này để tự trồng lúa và bán ra với giá 5 triệu VND. Mặt khác, dĩ nhiên anh Quân mong muốn mua lại các “nguyên liệu” của anh Việt với tổng số tiền phải trả là thấp nhất.

Ta cụ thể hoá những yêu cầu của anh Việt và mong muốn của anh Quân thành hai bài toán đối nghịch nhau về mục tiêu như trong hình bên.

Từ đó, anh Quân giải quyết bài toán của mình. Cũng như anh Việt, anh Quân thêm các biến mới $d$, $e$, $f$ lần lượt vào các bất phương trình bằng cách đặt:

$$
\begin{aligned}
d &= 3a + 4b + 2c - 5 && (1) \\
e &= 4a + b + 3c - 4 \\
f &= 2a + 2b + c - 3 && (2)
\end{aligned}
$$

Ta thấy rằng các biến mới mang giá trị không âm. Tiếp theo, nhân hai vế của phương trình (1) với 2 rồi cộng theo vế với phương trình (2), ta thu được

$$
2d + f = 8a + 10b + 5c - 13
$$

Đến đây ta suy ra được rằng $8a + 11b + 5c = 2d + f + b + 13 \ge 13$ vì $d$, $f$, $b$ đều là các biến không âm. Tại $d = f = b = 0$ thì ta có được $8a + 11b + 5c = 13$, khi đó thì $a = 1$, $e = 3$, $c = 1$. Vậy là anh Quân biết được số tiền mình phải trả cho anh Việt cũng là 13 triệu VND, bằng với số tiền anh Việt thu về được sau khi bán nông sản. Do đáp ứng được các điều kiện đã đưa ra của mình nên anh Việt cũng đồng ý với thương vụ này.

![Nguyên lý đối ngẫu: kết luận](./hinh-2.jpg)

Trong vấn đề của hai anh nông dân Việt và Quân, ta thấy rằng cả hai đều muốn thương vụ là có lợi nhất có thể với mình. Thậm chí, mỗi người đều nắm được rất rõ bài toán của mình và hiểu rằng nếu cả hai đều tìm được cho mình một phương án tối ưu thì sẽ không có ai thu về lợi ích nhiều hơn mức tối ưu ban đầu: anh Việt không thể bán được các “nguyên liệu” với giá cao hơn và anh Quân cũng không thể mua được các “nguyên liệu” đó với giá thấp hơn giá trị mục tiêu mà mỗi người đặt ra ban đầu, cũng chính là giá trị thực sự của lượng nông sản mà những “nguyên liệu” đó có thể sản xuất ra.

Tuy nhiên, trong trường hợp có một trong hai bên đề nghị một mức giá không tối ưu cho mình thì khi đó đối phương có thể lợi dụng điều này để hưởng lợi nhiều hơn dự tính ban đầu. Giả dụ, nếu anh Việt không tìm được một phương án phân bổ tốt cho việc sử dụng lượng “nguyên liệu” của mình và anh nghĩ chỉ bán được lượng nông sản với giá tối đa là 11 triệu VND thay vì 13 triệu VND như ở phương án tối ưu, lúc này anh Quân hoàn toàn có thể “lãi” 2 triệu VND bằng cách đồng ý mua toàn bộ lượng “nguyên liệu” đó với giá 11 triệu VND thay cho ý định ban đầu là mua với giá 13 triệu VND. Ngược lại, nếu anh Quân không tận dụng một cách tối đa những điều kiện của anh Việt và muốn mua toàn bộ “nguyên liệu” đó với mức giá 15 triệu VND thì lúc này anh Việt sẵn sàng bán vì biết rằng mình sẽ “lãi” thêm 2 triệu VND do sai lầm của đối phương. Để tránh tình huống xảy ra cho mình, mỗi người dù mua hay bán đều cần phải tìm được một phương án có lợi nhất cho bài toán kinh tế của mình. Thậm chí trong những trường hợp bài toán đặt ra là phi tuyến tính, dẫn đến giá trị tối ưu của hai bên có thể không còn như nhau, khi đó nắm rõ bài toán của đối phương là điều cần thiết. Những tình huống trên cho ta thấy tầm quan trọng của việc giải quyết được bài toán tối ưu và vai trò của nguyên lý đối ngẫu trong thực tế.

Nói chung, mọi bài toán quy hoạch tuyến tính đều có một bài toán đối ngẫu tương ứng và một bài toán đối ngẫu cũng là một bài toán quy hoạch tuyến tính. Điều này cho ta thấy nguyên lý đối ngẫu như một quy tắc kết nối một bài toán quy hoạch tuyến tính với một bài toán quy hoạch tuyến tính khác và mối liên kết này giúp cho việc nghiên cứu một trong hai bài toán cũng có ý nghĩa đối với bài toán còn lại. Hơn nữa, việc đặt hai bài toán quy hoạch tuyến tính trong mối quan hệ đối ngẫu thay vì nghiên cứu chúng một cách độc lập đã giúp ta linh hoạt trong việc chuyển đổi bài toán tối ưu. Đối ngẫu, hay tính hai mặt của một vấn đề, đóng một vai trò quan trọng trong việc nghiên cứu sự tương tác giữa các bài toán quy hoạch tuyến tính và đôi khi có thể đơn giản hoá bài toán ban đầu.
