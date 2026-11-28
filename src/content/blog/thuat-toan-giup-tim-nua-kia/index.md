---
title: "Thuật toán giúp tìm ‘nửa kia’"
date: 2018-02-14
author: "Nghĩa Nguyễn"
cover: ./cover.jpg
---

Phúc là một anh chàng 18 tuổi đầy tài năng: anh có một khuôn mặt điển trai, thân hình vạm vỡ và trái tim đầy khả ái; ngoài ra Phúc còn đánh đàn và hát rất hay, đặc biệt là giỏi toán nữa (dĩ nhiên rồi, anh học chuyên toán mà!!!). Phúc và mọi người đều biết rằng các cô gái ở trường Phúc đều đem lòng si mê Phúc, ai cũng mong muốn được một lần được trở thành một nửa của Phúc. Vì là một người ham học, nên suốt 18 năm anh không đoái hoài và không quen biết nhiều cô gái và đã từ chối biết bao nhiêu cô gái đến với anh; nhưng sắp tới mùa lễ tình nhân, anh nghĩ mình nên cho một ai đó ở trường mình một cơ hội. Tuy nhiên, anh cũng cần chọn lựa ai đó hợp ý mình chứ không phải chọn ngẫu nhiên; Phúc biết rằng, các cô gái sẽ đến và tiếp cận Phúc, Phúc chỉ có việc đồng ý hoặc từ chối thôi. Vậy Phúc sẽ nên chọn ai đây, người đầu tiên đến hay người đến cuối cùng?

Thế là một hôm, Phúc đã dành một buổi tối để suy nghĩ thuật toán để giúp anh giải được bài toán tình yêu. Tuy nhiên điều đầu tiên ta cần là phải khái quát được bài toán của Phúc:

- Là người chung thủy, Phúc chỉ muốn con tim mình hướng về một người thôi.
- Phúc cần một danh sách những cô gái mà họ sẽ đến tiếp cận Phúc (VD như Phúc muốn tìm bạn nữ ở PTNK thì Phúc chỉ có hữu hạn những cô gái đó và danh sách này sẽ cố định).
- Phúc có một tiêu chuẩn đánh giá riêng, với mỗi ứng viên, Phúc sẽ xem xét cô ấy có phù hợp với gu của mình hay không. Mỗi cô gái như vậy sẽ có một mức độ hài lòng của Phúc khác nhau.
- Những người đến và tỏ tình với Phúc theo một thứ tự ngẫu nhiên. Do Phúc không biết mặt các cô gái này nên Phúc không thể biết rằng ai là người đẹp nhất để mà chọn. Khi họ đến Phúc mới có thể đánh giá họ được thôi.
- Khi họ tỏ tình, Phúc ngay lập tức sẽ xem xét dựa trên tiêu chí của mình và có thể trả lời một trong hai câu: “Em đi về đi” hoặc “Mình yêu nhau đi”. Với câu trả lời thứ nhất thì cô gái ấy sẽ tránh mặt Phúc và Phúc với cô ấy sẽ không thể gặp lại nữa; còn với câu trả lời thứ hai thì bài toán của Phúc sẽ hoàn tất. Qua cách chấm điểm của Phúc, Phúc muốn chọn cô gái càng chỉ số cao càng tốt.

Vậy Phúc sẽ chọn người đến thứ mấy đây? Nếu câu trả lời là nên chọn cô gái đầu tiên vừa hợp tiêu chuẩn Phúc thì có lẽ là hơi vội; bởi có thể còn một cô gái cực kì xinh đẹp nào đó đến sau thì sao?

Bài toán trên nghe có vẻ hóc búa, tuy nhiên với tài năng toán học của mình, chỉ trong vòng chưa đầy một buổi tối, Phúc đã tìm cho mình một lời giải khá hay. Phúc chuyển lời bài toán thành: “Đánh số những ứng cử viên từ 1 đến $N$. Tìm $r < N$ sao cho ta sẽ từ chối $r$ người đầu tiên, và sẽ đồng ý đối với người đầu tiên sau $r$ người đó sao cho người đó có chỉ số cao hơn $r$ người đầu tiên. Và xác suất để tìm thấy được người ứng viên này theo biến $r$ gọi là $P(r)$, chính vì vậy ta cần tìm $r$ để $P(r)$ lớn nhất”. Nếu Phúc tính toán được $P(r)$, và nếu nó khả vi nữa, thì ôi tốt quá! Phúc chỉ cần tìm $r$ là nghiệm của $P'(r) = 0$ mà thôi (theo bổ đề Fermat).

Gọi ứng cử viên sáng giá nhất là $X$. Phúc muốn chọn người sau $r$ nên giả sử ta xét một biến $n$ sau $r$ sao cho ta sẽ chọn người thứ $n + 1$. Và $X$ có thể được chọn ở vị trí $n + 1$ nếu như 2 điều kiện sau thỏa mãn:

- $N - 1 \ge n \ge r$;
- Ứng cử viên sáng giá nhất trong đoạn $[1, n]$ cũng là ứng cử viên sáng giá nhất trong đoạn $[1, r]$.

Xác suất để hai điều này xảy ra chính là $\frac{1}{N} \cdot \frac{r}{n}$.

Lúc này, ta có thể tính $P(r)$ bằng tổng các xác suất có thể xảy ra ứng với mỗi $N > n \ge r$:

$$
P(r) = \frac{1}{N}\left[\frac{r}{r} + \frac{r}{r + 1} + \cdots + \frac{r}{N - 1}\right] = \frac{r}{N}\left[\frac{1}{r} + \frac{1}{r + 1} + \cdots + \frac{1}{N - 1}\right].
$$

Đến đây Phúc làm một phép biến hóa tuyệt vời: Phúc nhận ra $P(r)$ chỉ là một xấp xỉ với tích phân Riemann. Muốn tính ra phép tính trên, Phúc sẽ cho $N \to \infty$ và đặt $\lim_{N \to \infty} r/N = x$ thì $P(r) = -x\ln x$. Tính toán thì được $P'(x) = -\ln x - 1$; lúc này nghiệm của PT $P'(x) = 0$ chính là $x = 1/e$ hay $r/N = 1/e$; từ đó Phúc suy ra $r = N/e \approx 0.37N$.

Đúc kết lại, Phúc có một thuật toán để có thể tìm được nửa kia ưng ý nhất cho Phúc mùa Valentine mình:

- Lập một danh sách những ứng cử viên và tính tổng số ứng cử viên đó.
- Tính toán $P = N/e \approx 0.37N$.
- Hẹn gặp mà từ chối $P$ người đầu tiên; những người này sẽ giúp bạn có được thang đo.
- Tiếp tục hẹn những người còn lại, xem người nào là người đầu tiên tốt hơn $P$ người đầu tiên đó. Hãy chấp nhận liền. Đừng tham lam!
- Đặt lịch khách sạn, nhà nghỉ,… các thứ chuẩn bị cho mùa Valentine ấm áp.

Hãy học hỏi Phúc, các bạn nhé!

## Tài liệu tham khảo

- \[1\] <https://en.wikipedia.org/wiki/Secretary_problem>
- \[2\] <https://www.npr.org/sections/krulwich/2014/05/15/312537965/how-to-marry-the-right-girl-a-mathematical-solution>
- \[3\] <https://thebryanhernandezgame.files.wordpress.com/2010/05/secretary-problem.pdf>

Nguồn ảnh: Robert Krulwich.
