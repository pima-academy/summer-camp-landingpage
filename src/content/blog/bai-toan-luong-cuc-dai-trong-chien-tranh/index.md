---
title: "Bài toán luồng cực đại trong chiến tranh"
date: 2019-11-10
cover: ./cover.jpg
---

Lý thuyết đồ thị có nhiều bài toán có ứng dụng rất rộng rãi và thiết thực. Hôm nay hãy cùng PiMA đến với bài toán tìm luồng cực đại (Maxflow) và ảnh hưởng của nó trong thời kì chiến tranh lạnh nhé.

## Lịch sử

Trong thời kỳ chiến tranh lạnh, Liên Xô vận chuyển hàng hoá tới các nước đồng minh Đông Âu chủ yếu là bằng một mạng lưới đường sắt cực kì to lớn và phức tạp. Do đó, quân đội Mỹ muốn biết được khả năng cung cấp hàng hoá của Liên Xô tới các nước đồng minh là lớn đến mức nào. Với thông tin về các tuyến đường sắt, khả năng vận chuyển của mỗi tuyến (tính theo số tấn hàng có thể vận chuyển sang tuyến đường đó trong ngày), bài toán đặt ra là phải tìm được lưu lượng hàng hoá lớn nhất có thể vận chuyển qua hệ thống đó trong một ngày, đây còn gọi là bài toán tìm luồng cực đại.

Với các thông tin có được, năm 1955, Ted Harris và Frank S. Ross đã viết một bản báo cáo cho không quân Mỹ. Trong bản báo cáo đó, họ đã xem hệ thống đường sắt như là một đồ thị, đỉnh của đồ thị tương ứng là các nhà ga, mỗi cạnh của đồ thị là tuyến đường sắt nối giữa các ga và có gán một số không âm tượng trưng cho số tấn hàng hoá có thể vận chuyển sang tuyến đường đó mỗi ngày.

## Cách tiếp cận toán học

![Bên trái: đồ thị có hướng 6 đỉnh với sức chứa 1→2 là 5, 1→3 là 5, 2→4 là 6, 2→5 là 3, 3→4 là 3, 3→5 là 1, 4→6 là 6, 5→6 là 6. Bên phải: cùng đồ thị với mỗi cạnh ghi lượng hàng vận chuyển và sức chứa, 1→2 là 5:5, 1→3 là 2:5, 2→4 là 5:6, 2→5 là 0:3, 3→4 là 1:3, 3→5 là 1:1, 4→6 là 6:6, 5→6 là 1:6](./hinh-1.jpg)

Giả sử ta xét hệ thống đường sắt của Liên Xô như sau:

- Đỉnh 1 là tượng trưng cho một ga tàu nguồn ở Liên Xô.
- Đỉnh 6 tượng trưng cho một ga tàu đích ở nước đồng minh.
- Các đỉnh còn lại tượng trưng cho các ga tàu trung gian trong quá trình vận chuyển.
- Các mũi tên biểu diễn cho có một đường ray nối từ ga này tới ga tiếp theo (cạnh), con số trên cạnh là số lượng hàng hoá có thể vận chuyển qua đường ray đó trong một ngày (còn gọi là sức chứa của cạnh).

Với mô hình đồ thị trên, một cách đưa hàng hóa (một luồng) tương đương với việc gán cho mỗi cạnh một số không âm (biểu thị cho lượng hàng hóa vận chuyển sang cạnh đó trong ngày). Các con số này phải thỏa mãn các điều kiện sau:

- Các số trên cạnh không được vượt quá sức chứa của cạnh (vận chuyển quá sức chứa của đường ray có thể dẫn tới hư hỏng).
- Ngoại trừ đỉnh 1 và 6, tổng số lượng hàng được vận chuyển vào đỉnh đó phải bằng với tổng số lượng hàng được vận chuyển ra khỏi đỉnh đó (tất nhiên ta không muốn việc hàng tồn kho).

Giá trị của luồng là tổng các con số gán cho từng cạnh đi tới đỉnh 6. Rõ ràng đây cũng là tổng số lượng hàng hóa được chuyển qua hệ thống trên. Mục tiêu của ta là tìm cách vận chuyển có tổng lượng hàng hóa lớn nhất, cũng chính là tìm luồng có giá trị lớn nhất (luồng cực đại).

Hình bên phải cho thấy một cách vận chuyển thoả các điều kiện trên.

Lưu ý rằng trong hình bên phải, ở mỗi cạnh có 2 số, số đầu là lượng hàng hoá ta sẽ vận chuyển sang cạnh đó, số sau chính là sức chứa của cạnh.

## Thuật toán giải tổng quát

Trên thực tế, hệ thống đường sắt của Liên Xô phức tạp hơn nhiều, vì vậy ta cần có một thuật toán để giải trường hợp tổng quát hơn. Hai nhà toán học Ted Harris và Frank S. Ross đã đề xuất một thuật toán tham lam để tìm luồng cực đại trong bản báo cáo của mình. Dù thuật toán đó chưa thể đưa ra được một kết quả chính xác, nhưng nó lại mang một ý nghĩa lịch sử to lớn, đó là lần đầu tiên bài toán luồng cực đại được định nghĩa và nghiên cứu. Tới năm 1956, Lester R. Ford, Jr. và Delbert R. Fulkerson đã đưa ra thuật toán có thể tính được chính xác luồng cực đại của đồ thị, do thành quả to lớn đó, tên của họ đã được đặt cho thuật toán đó: thuật toán Ford–Fulkerson.

Chưa hết, để đề phòng khả năng xảy ra chiến tranh, không quân Mỹ muốn biết cần phải phá huỷ ít nhất bao nhiêu tuyến đường sắt để có thể làm tê liệt toàn bộ hệ thống đường sắt của Liên Xô tới các nước đồng minh. Bài toán này sau này được gọi là bài toán tìm lát cắt cực tiểu/lát cắt hẹp nhất. Hoá ra lời giải của bài toán luồng cực đại cũng chính là lời giải cho bài toán tìm lát cắt cực tiểu, điều này được chứng minh là đúng bằng định lý “luồng cực đại - lát cắt cực tiểu”, đưa ra bởi Ford và Fulkerson vào năm 1962.

Đến nay, bài toán luồng cực đại vẫn nhận được rất nhiều sự quan tâm của giới nghiên cứu vì tính ứng dụng của nó, một số ứng dụng có thể kể đến như: phân tách hình ảnh, bài toán sắp xếp lịch giảng dạy, lập lịch cho máy bay, …

## Tài liệu tham khảo

- <https://www.cs.princeton.edu/~wayne/cs423/lectures/max-flow-applications>
- <https://en.wikipedia.org/wiki/Maximum_flow_problem>
- <https://en.wikipedia.org/wiki/Max-flow_min-cut_theorem>
- Harris, T. E.; Ross, F. S. (1955). "Fundamentals of a Method for Evaluating Rail Net Capacities"
