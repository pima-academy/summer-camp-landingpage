---
title: "Bài toán chia kẹo và nguyên lý Dirichlet"
date: 2026-11-27
author: "Nguyễn Văn A"
description: "Một bài toán chia kẹo quen thuộc, và vì sao chỉ cần đếm là đủ để giải nó."
draft: true
---

Một lớp học có 30 bạn và cô giáo mang đến 29 chiếc kẹo. Dù chia thế nào, luôn có ít nhất một bạn không nhận được chiếc kẹo nào. Điều này nghe hiển nhiên, nhưng chính ý tưởng đơn giản ấy lại giải được nhiều bài toán khó.

<!--more-->

## Nguyên lý Dirichlet

Nếu xếp nhiều hơn n đồ vật vào n chiếc hộp, thì có ít nhất một chiếc hộp chứa từ hai đồ vật trở lên. Nguyên lý này còn được gọi là nguyên lý chuồng bồ câu.

## Một ví dụ

Trong 13 người bất kỳ, luôn có hai người sinh cùng tháng:

- Có 12 tháng, tương ứng với 12 chiếc hộp.
- Có 13 người, tương ứng với 13 đồ vật.
- Vì 13 > 12, có ít nhất một tháng là tháng sinh của hai người trở lên.

> Đếm đúng thường quan trọng hơn tính nhanh.

| Số người | Số tháng | Chắc chắn có hai người cùng tháng sinh? |
| --- | --- | --- |
| 12 | 12 | Không |
| 13 | 12 | Có |

Bạn hãy thử áp dụng nguyên lý này cho bài toán sau: chọn 6 số bất kỳ từ 1 đến 10, chứng minh rằng luôn có hai số có tổng bằng 11.
