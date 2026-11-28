---
title: "Hiểu về phép nhân ma trận"
date: 2020-04-17
cover: ./cover.jpg
---

[Kì trước](/blog/ma-tran/), chúng ta đã làm quen với ma trận và các phép toán của nó. Trong lần này, chúng ta sẽ cùng khám phá những góc nhìn khác nhau xoay quanh phép nhân 2 ma trận, một phép toán cực kì quan trọng và có rất nhiều ứng dụng thực tế nhé!

Để phục vụ cho việc tìm hiểu dưới đây, ta cần hiểu một khái niệm quan trọng: tổ hợp tuyến tính.

Giả sử ta có hai ma trận $A$ và $B$. Từ hai ma trận này, ta có thể tạo được nhiều ma trận khác nhau chỉ từ 2 phép toán

- Phép nhân một ma trận với một số vô hướng.
- Phép cộng hai ma trận.

Ví dụ ta có thể nhân 2 với $A$ để tạo nên ma trận $2A$ có các phần tử lớn hơn phần tử tương ứng của $A$ hai lần. Hoặc ta cũng có thể nhân 3 với $B$ để được ma trận $3B$. Sau đó ta sẽ cộng 2 ma trận lại với nhau để tạo thành một ma trận mới: $2A + 3B$.

Những ma trận được tạo ra theo cách trên được gọi chung là tổ hợp tuyến tính của $A$ và $B$. Các ma trận này có dạng tổng quát $xA + yB$. Trong đó $x$ và $y$ là các số vô hướng, đại diện cho hệ số của ma trận $A$ và $B$. Bằng cách thay đổi $x$ và $y$ ta sẽ có được tất cả các “tổ hợp của $A$ và $B$”.

Ví dụ về tổ hợp tuyến tính: $0, A, B, 2A, 3B, 2A + 3B, 3.14A + 2.82B, \ldots$

Khái niệm tổ hợp tuyến tính có thể mở rộng cho nhiều hơn 2 ma trận, ví dụ $xA + yB + zC$ là tổ hợp tuyến tính của 3 ma trận $A$, $B$ và $C$.

Kế tiếp ta sẽ tìm hiểu các cách nhìn khác nhau về nhân hai ma trận.

## Cách thứ nhất: tích vô hướng của hàng và cột

![Cách thứ nhất: ma trận [9 5 2; 4 2 0] nhân ma trận [3 5; 7 6; 8 0] bằng [78 75; 26 32]; mỗi phần tử là tích vô hướng của một hàng và một cột, ví dụ 9·3 + 5·7 + 2·8 = 78](./hinh-1.jpg)

Nhắc lại định nghĩa của phép nhân ma trận kì trước. Giả sử ma trận $A$ có chiều $(m \times n)$ và ma trận $B$ có chiều $(n \times p)$. Kết quả của phép nhân $A$ và $B$ là ma trận có chiều $(m \times p)$ và được kí hiệu $AB$. Trong đó phần tử ở hàng $i$ và cột $j$ của $AB$ sẽ được tính trực tiếp bằng cách lấy tích vô hướng của hàng $i$ của ma trận $A$ với cột $j$ của ma trận $B$:

$$
(AB)_{ij} = A_{i1} B_{1j} + A_{i2} B_{2j} + A_{i3} B_{3j} + \dots + A_{in} B_{nj}
$$

Hình trên là phép nhân của ma trận $(2 \times 3)$ với ma trận $(3 \times 2)$. Kết quả là một ma trận $(2 \times 2)$. Phần tử đầu tiên, 78, là kết quả của tích vô hướng giữa hàng đầu tiên của ma trận thứ nhất và cột đầu tiên của ma trận thứ hai. Tương tự cho các phần tử tiếp theo.

## Cách thứ hai: nhân ma trận bằng tổ hợp tuyến tính các cột

![Cách thứ hai: mỗi cột của tích là tổ hợp tuyến tính các cột của ma trận [9 5 2; 4 2 0], ví dụ 3·[9; 4] + 7·[5; 2] + 8·[2; 0] = [78; 26]](./hinh-2.jpg)

Trong phép nhân ma trận $A$ và $B$ phía trên, ma trận $B$ có chiều $(n \times p)$ nên cột của $B$ sẽ là một ma trận cột có chiều $(n \times 1)$. Nếu ta lấy ma trận $A$ nhân lần lượt với các cột của ma trận $B$ ta sẽ được lần lượt các cột tương ứng của ma trận $AB$.

Một điều thú vị là mỗi cột của $AB$ lại là một tổ hợp tuyến tính của các cột của $A$ với các hệ số được lấy từ cột tương ứng của $B$.

## Cách thứ ba: nhân ma trận bằng tổ hợp tuyến tính các hàng

![Cách thứ ba: mỗi hàng của tích là tổ hợp tuyến tính các hàng của ma trận [3 5; 7 6; 8 0], ví dụ 9·[3 5] + 5·[7 6] + 2·[8 0] = [78 75]](./hinh-3.jpg)

Một cách tương ứng, nếu ta lấy từng hàng của $A$ nhân với ma trận $B$, ta sẽ được các hàng tương ứng của ma trận $AB$.

Và mỗi hàng của $AB$ lại là tổ hợp tuyến tính của các hàng của $B$ với các hệ số được lấy từ hàng tương ứng của $A$.

## Cách thứ tư: nhân cột với hàng

![Cách thứ tư: tích bằng tổng [9; 4][3 5] + [5; 2][7 6] + [2; 0][8 0] = [78 75; 26 32], trong đó [9; 4][3 5] = [27 45; 12 20]](./hinh-4.jpg)

Ở cách thứ nhất, phần tử ở hàng $i$, cột $j$ của $AB$ có thể được tính trực tiếp bằng cách lấy tích vô hướng của hàng thứ $i$ của $A$ và cột thứ $j$ của $B$. Bây giờ ta sẽ thực hiện phép nhân bằng cách nhân cột của $A$ với hàng của $B$.

Ma trận $A$ có chiều $(m \times n)$, cột của $A$ sẽ có chiều $(m \times 1)$. Ma trận $B$ có chiều $(n \times p)$, hàng của $B$ sẽ có chiều $(1 \times p)$. Kết quả phép nhân một cột của $A$ và một hàng của $B$ là ma trận có chiều $(m \times p)$, bằng với chiều của $AB$!!!

Ta có thể tính được $AB$ bằng cách lấy tổng các phép nhân lần lượt các cột của $A$ với hàng tương ứng của $B$.

## Giới thiệu thông qua COVID-19 stochastic matrix

![Vector chuyển hóa của người khỏe mạnh (0.99, 0.007, 0.003); 10 triệu người khỏe mạnh sau một ngày thành 9.9, 0.07 và 0.03 triệu; ma trận chuyển hóa giữa ba diện khỏe mạnh, cách ly, dương tính; ma trận dữ liệu của Ý (60, 3, 2 triệu) và Hàn Quốc (50, 2, 1 triệu)](./hinh-5.jpg)

Trước diễn biến phức tạp của dịch bệnh COVID-19, đây là thời gian không thể thích hợp hơn để ta cùng tìm hiểu một phép toán rất hữu ích trong thống kê lẫn nhiều lĩnh vực khác: phép nhân hai ma trận. Cụ thể hơn, ta sẽ cùng làm rõ 4 cách hiểu khác nhau về phép toán này qua ví dụ về dịch bệnh COVID-19.

Để đơn giản hoá, ta giả sử dân số của một nước được chia làm 3 diện: khoẻ mạnh, cách ly theo dõi (nghi nhiễm) và dương tính với COVID-19 và biết rằng các dân số giữa các diện này có thể chuyển dịch qua lại cho nhau. Đặt ví dụ, cứ mỗi ngày trôi qua, tỉ lệ những người khoẻ mạnh bị chuyển sang cách ly theo dõi là 0.7%, tỉ lệ người khoẻ mạnh bị xét nghiệm dương tính 0.3% và 99% người dân còn lại vẫn thuộc diện khoẻ mạnh. Khi đó ta có một vector hệ số đại diện cho sự chuyển hoá của nhóm người khỏe mạnh sau mỗi ngày, biểu diễn như hình trên.

Điều này có nghĩa, nếu số lượng người khoẻ mạnh lúc đầu là 10 triệu người, thì qua ngày hôm sau, ta sẽ có số người ở 3 diện lần lượt là 9,9 triệu người, 0,07 triệu người và 0,03 triệu người. Những con số này được tính bằng cách lấy số người khỏe mạnh nhân cho vector chuyển hóa của người khỏe mạnh.

Cho biết thêm, qua mỗi ngày tỉ lệ người nghi nhiễm (cách ly) cho kết quả dương tính là 20% và cho kết quả âm tính là 30%, số người còn lại vẫn cần theo dõi tiếp. Cuối cùng, tỉ lệ hồi phục của những người đã nhiễm là 31%, và không có ai trong số đó chuyển sang lại trạng thái nghi nhiễm cả. Tương tự, ta cũng có 3 vectors đại diện cho sự chuyển hoá của 3 nhóm người. Ghép 3 vector này lại ta có được một ma trận có tên là Ma Trận Chuyển Hóa.

Sau cùng nếu ta biết được dân số của các diện ở hai nước Ý và Hàn Quốc (được thể hiện bằng Ma Trận Dữ Liệu) vào hôm nay thì các con số này sẽ thay đổi thế nào vào ngày mai?

Đáp án cho bài toán có thể tìm thấy rất dễ dàng thông qua việc nhân 2 ma trận trên với nhau. Bài toán đơn giản này có thể được giải quyết bằng nhiều cách khác nhau và chính những cách này gợi ý cho chúng ta nhiều cách hiểu khác nhau về phép nhân ma trận, chúng ta hãy cùng tìm hiểu các cách đó.

### Cách thứ nhất: tích vô hướng của hàng và cột

Ta để ý rằng số người khoẻ mạnh ở Ý vào ngày mai sẽ bao gồm ba phần: một phần là những người khoẻ mạnh còn lại từ ngày hôm nay, một phần chuyển từ diện bị cách ly và một phần là những người dương tính khỏi bệnh. Phép tính tương ứng như sau:

$$
60 \cdot 0.99 + 3 \cdot 0.3 + 2 \cdot 0.31 = 60.92
$$

Tương tự cho các diện khác của Ý và Hàn Quốc. Các phép tính này có đặc điểm chung là nhân lần lượt các phần tử từ hàng ở Ma Trận Chuyển Hóa với cột ở Ma Trận Dữ Liệu. Sự trùng khớp với phép nhân ma trận này gợi ý cho chúng ta mô hình hoá bài toán thành phép nhân ma trận.

### Cách thứ hai: nhân cột với hàng

Ở cách thứ hai này, ta có thể xem toàn bộ ma trận kết quả sẽ được cấu thành gồm 3 phần, một phần xuất phát từ nhóm người khoẻ mạnh, một phần xuất phát từ diện cách ly và sau cùng là diện đã nhiễm bệnh. Ta lần lượt tính 3 ma trận này một cách độc lập và cộng chúng lại.

Vì ta muốn biết được những người khỏe mạnh ngày hôm nay đã chuyển dịch như thế nào nên ta sẽ phải quan tâm 2 điều. Thứ nhất là tỉ lệ chuyển sang các diện khác của nhóm người khỏe mạnh, điều này được thể hiện ở cột thứ nhất của Ma Trận Chuyển Hóa. Thứ hai, ta cần biết xem hôm nay có bao nhiêu người đang khỏe mạnh ở Ý và Hàn Quốc. Sau cùng ta sẽ thu được một ma trận xuất phát từ nhóm người khỏe mạnh.

Kế đến ta quan tâm đến cách những người bị cách ly sẽ chuyển dịch sang các diện khác vào ngày mai. Ta sẽ nhân cột thứ hai của Ma Trận Chuyển Hóa (thể hiện tỉ lệ chuyển dịch của nhóm người cách ly) với hàng thứ hai của Ma Trận Dữ Liệu (thể hiện số người đang bị cách ly ngày hôm nay).

Tương tự cho nhóm người nhiễm bệnh vào ngày hôm nay.

### Cách thứ 3: nhân ma trận với cột

Một cách khác, ta cũng có thể tính kết quả riêng cho từng nước một cách độc lập rồi sau đó ghép chúng lại. Trong trường hợp này ta sẽ tính số lượng các diện của nước Ý vào ngày mai, sau đó tính cho Hàn Quốc, và ghép 2 kết quả lại để được một ma trận.

Ta sẽ lấy lần lượt số người ở từng diện ở Ý nhân cho vector chuyển hóa tương ứng của diện đó và cộng chúng lại. Tương tự đối với Hàn Quốc.

### Cách thứ 4: nhân hàng với ma trận

Trong cách cuối cùng, ta sẽ tính mỗi diện ở 2 nước một cách độc lập, sau đó sẽ ghép chúng lại để tạo thành ma trận.

Cụ thể, số người khỏe mạnh vào ngày mai của 2 nước sẽ bằng hàng thứ nhất của Ma Trận Chuyển Hóa nhân với Ma Trận Dữ Liệu.
