# Flip Master 操盤手全面翻紅

原生 HTML/CSS/JavaScript 教學遊戲。直接開啟 index.html，或執行 `python -m http.server 8080`。

## 功能
- 3×3、4×4、5×5、3×4、3×6；經典全黑與隨機可解棋盤。
- 相鄰上下左右連動；GF(2) 高斯消去求解提示，不宣稱最短解。
- 保存每次點擊的座標、時間、受影響棋子、翻動前後盤面；重新整理可繼續。
- 學生個人回顧；老師匯入多份 JSON、搜尋、統計、逐步重播、JSON 與 CSV 匯出。
- 離線資料只在同一瀏覽器，護照是篩選條件而非安全登入；共用裝置請使用不同瀏覽器使用者。

## 雲端設定
GitHub Pages 僅提供靜態網站，不會自動集中學生紀錄。
1. 建立 Supabase 專案，在 SQL editor 執行 supabase.sql。
2. 在 Authentication 建立師生帳號；管理者用 SQL 將老師 UUID 加入 teachers。
3. 在頁面雲端設定填 URL、公開 anon key；不得使用 service_role。
4. 學生登入，填老師 UUID，按上傳我的紀錄；老師登入後按更新雲端資料。
5. 登入 token 僅存在記憶體，重整後需重登；紀錄需手動上傳。雲端政策限制學生只讀寫自己的資料、老師只讀分配給自己的資料。

## GitHub Pages
Repository Settings → Pages → Source 選 GitHub Actions。推送 main 觸發部署。預期網址 https://YangShengWen-0505.github.io/flip-master/ 。未成功部署前不得視為已上線。

## 來源與設計
遊戲依使用者提供的科展 PDF 080409「操盤手－全面翻紅」相鄰翻面規則重新實作。文件的推論不全當成規則：翻過邊格仍可再次翻回；以實際盤面判定成功。
設計參考：https://github.com/leonxlnx/taste-skill 與 https://github.com/google-labs-code/design.md 。未複製其程式碼或安裝外部技能。
