---
title: "Định luật Zipf"
date: 2020-03-26
cover: ./cover.jpg
---

Đầu năm 2020, đại dịch Covid19 bùng phát, kỳ nghỉ Tết kéo dài 2 tháng vẫn chưa thấy hồi kết, quá nhàm chán, Phúc quyết định tự học tiếng Anh. Nhưng do quá bế tắc trong việc học từ vựng, Phúc đã nảy ra một ý tưởng học từ vựng mới: học những từ được sử dụng nhiều nhất trong tiếng Anh trước. Phúc đã tìm ra 5000 từ vựng được dùng nhiều nhất trong tiếng Anh ở trang <https://www.wordfrequency.info/>, trong đó, 10 từ được dùng nhiều nhất là “the”, “be”, “and”, “of”, “a”, “in”, “to”, “have”, “I”, “it”. Phúc quyết định ngày đầu tiên sẽ học 100 từ thông dụng nhất. Là một người có niềm đam mê với dữ liệu, Phúc đã dựng biểu đồ về tần suất xuất hiện của 100 từ đó (như hình đầu bài).

Phúc nhận ra một điều đặc biệt về biểu đồ này đó là nhìn nó rất giống đồ thị của hàm $1/x$. Anh ấy đem kết quả này đi hỏi khắp nơi rằng tại sao biểu đồ lại đẹp một cách kỳ lạ đến vậy. Cuối cùng, Phúc đã tìm ra được định luật liên quan tới điều này, đó là định luật Zipf (Zipf’s law). Khi xem xét về tần suất xuất hiện của các từ trong tiếng Anh, nhà ngôn ngữ học người Mỹ George Kingsley Zipf nhận ra nếu ta sắp xếp các từ dựa vào số lần xuất hiện của nó theo thứ tự từ lớn đến bé thì số lần xuất hiện của một từ tỉ lệ nghịch với xếp hạng của nó. Nói cách khác, từ xếp ở xếp hạng thứ $n$ sẽ xuất hiện với số lần xấp xỉ $1/n$ tần suất của từ xuất hiện nhiều nhất. Ví dụ: từ “be” (xếp thứ 2) sẽ có số lần xuất hiện xấp xỉ $1/2$ của từ “the”; từ “and” (xếp thứ 3) xuất hiện với tần số xấp xỉ $1/3$ từ “the”.

Tạm gọi $r$ là thứ hạng của từ và $f(r)$ là tần suất xuất hiện tương ứng, do $r$ và $f(r)$ tỉ lệ nghịch với nhau: $f(r) \approx 1/r$. Khi ta lấy log 2 vế: $\log f(r) \approx -\log r$, do đó, nếu vẽ biểu đồ trên thang logarithm (lấy log 2 trục) thì biểu đồ có dạng một đường thẳng với hệ số góc -45 độ (như hình đầu bài).

Đáng ngạc nhiên hơn, quy luật này không chỉ xuất hiện ở tiếng Anh mà còn hầu hết mọi ngôn ngữ, kể cả ngôn ngữ cổ (ví dụ như ngôn ngữ Meroitic, một ngôn ngữ xuất hiện vào khoảng 300 năm trước công nguyên) \[1\]. Vào năm 2001, nghiên cứu của Alexander Gelbukh và Grigori Sidorov \[2\] đã chỉ ra rằng với những bộ dữ liệu đủ lớn trên ngôn ngữ, thì thứ hạng và tần suất xuất hiện của một từ sẽ có liên hệ với nhau qua hệ thức: $\log f(r) \approx C - z \log r$, với $C$ là hằng số, $r$ là thứ hạng của từ, và $f(r)$ là số lần xuất hiện tương ứng, $z$ là một hệ số tiệm cận 1, và $z$ thay đổi tùy vào từng loại ngôn ngữ.

Định luật Zipf còn xuất hiện ở một số loại dữ liệu khác như tần suất của từ trong một quyển sách bất kỳ, xếp hạng dân số của các thành phố trong 1 quốc gia, hay xếp hạng thu nhập cá nhân, xếp hạng lượt truy cập website.

Dù xuất hiện ở rất nhiều loại dữ liệu, đã có nhiều nghiên cứu nhưng cho đến nay, người ta vẫn chưa có giải thích đủ tốt về việc tại sao sự phân phối của các dữ liệu lại tuân theo định luật Zipf.

## Tài liệu tham khảo

- <https://www.youtube.com/watch?v=fCn8zs912OE>
- \[1\] <https://arxiv.org/ftp/arxiv/papers/0808/0808.2904.pdf>
- \[2\] <https://www.gelbukh.com/CV/Publications/2001/CICLing-2001-Zipf.htm>
- <https://en.wikipedia.org/wiki/Zipf%27s_law>

**Đọc thêm**

- Human Behavior and the Principle of Least Effort: <https://archive.org/details/in.ernet.dli.2015.90211>
- Nguyên lý Pareto (luật 80 20): <https://en.wikipedia.org/wiki/Pareto_principle>
