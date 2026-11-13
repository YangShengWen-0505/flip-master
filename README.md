# Flip Master 操盤手全面翻紅

原生 HTML/CSS/JavaScript 教學遊戲。直接開啟 index.html，或執行 `python -m http.server 8080`。

## 功能
- 3×3、4×4、5×5、3×4、3×6；經典全黑與隨機可解棋盤。
- 相鄰上下左右連動；GF(2) 高斯消去求解提示，不宣稱最短解。
- 保存每次點擊的座標、時間、受影響棋子、翻動前後盤面；重新整理可繼續。
- 學生個人回顧；老師匯入多份 JSON、搜尋、統計、逐步重播、JSON 與 CSV 匯出。
- 離線資料只在同一瀏覽器，護照是篩選條件而非安全登入；共用裝置請使用不同瀏覽器使用者。

## 課堂自動收集
改用 Google Apps Script + 私人 Google 試算表。學生直接開 GitHub Pages 根網址即可玩，不需要註冊或登入。每 3 秒送出最新紀錄，老師每 10 秒更新。斷線保留佇列，重新上網補傳；需保持網頁開啟。
老師只輸入管理密碼即可登入；密碼不包含在網站原始碼。主選單與遊戲採用《時光代理人》三位角色的 AI 生成插畫與照相館配色。

後端一次性設定見 [GOOGLE_SETUP.md](GOOGLE_SETUP.md)。舊 supabase.sql 僅保留為先前版本參考，前端已不使用。

## GitHub Pages
Repository Settings → Pages → Source 選 GitHub Actions。推送 main 觸發部署。預期網址 https://YangShengWen-0505.github.io/flip-master/ 。未成功部署前不得視為已上線。

## 來源與設計
遊戲依使用者提供的科展 PDF 080409「操盤手－全面翻紅」相鄰翻面規則重新實作。文件的推論不全當成規則：翻過邊格仍可再次翻回；以實際盤面判定成功。
設計參考：https://github.com/leonxlnx/taste-skill 與 https://github.com/google-labs-code/design.md 。未複製其程式碼或安裝外部技能。
