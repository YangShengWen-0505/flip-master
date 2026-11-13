# 00_LOCAL.md — 專案本機速查
## 專案狀態
Flip Master，原生網頁；2026-11-13 建立。GitHub Pages 既有版本已上線；Google 接收服務已部署，線上學生傳送及老師自動更新測試通過。
## 服務與平台
GitHub: YangShengWen-0505/flip-master；Pages 靜態部署。改用 Google Apps Script 與私人試算表。
## 帳號與憑證參照
Git credential 可推送；Google 初始化已完成授權。學生寫入碼與接收網址已內建 sync.js，供公開網站自動傳送；老師管理密碼僅在私人試算表與 Script Properties，前端登入期間只保存在記憶體。
## 設定、建置與發行
無建置依賴。python -m http.server 8080。main 推送由 .github/workflows/pages.yml 部署，先設定 Pages Source 為 GitHub Actions。
## 資料、備份與復原
離線 localStorage，JSON 匯出匯入備份。清除瀏覽器會失去離線紀錄。老師彙整和學生紀錄分開儲存。sync.js 自動重試與收件確認；Google 接收端使用寫入憑證與老師讀取密碼。
## 費用、續約與外部期限
未開通付費服務。學生請用座號或暱稱；公開 repository 不放學生資料。
## 待確認事項
已驗證：GitHub Pages 兩個獨立頁面，測試學生完成 3×3 五步翻紅，老師自動收到 1 筆成功紀錄，重播第 5 步九格全紅。尚未以兩台實體裝置測試。
## 參考資料與更新
README.md、GOOGLE_SETUP.md、google-apps-script/Code.gs。2026-11-13 完成 Apps Script v1 部署及線上收件實測。測試班紀錄保留以供檢查。

接收端：https://script.google.com/macros/s/AKfycbyhoRjHHdJc340fTca57a_uZfygt4x_OXRV4GFQ5LDY-ENfshdnDbLKVhXBzkNtQLUX/exec

2026-11-13 更新：主選單與全遊戲角色主題、免設定學生直連、老師單一密碼登入。assets/time-studio.png 隨 GitHub Pages workflow 部署。

新增 dialogue.js 角色對話（隨 Pages 工作流程部署）。老師入口改為開始遊戲後填座號 00 或 -1，再輸入管理密碼；此座號僅路由，不授予讀取權限。學生記錄名稱包含座號與姓名，舊紀錄仍保留原格式。

新增 effects.js：Web Audio 音效與動畫，無外部音訊服務／費用；隨 Pages 部署。fm-sound 儲存本機開關；音訊不會上傳。資源版本 20261113-motion，主選單使用明確圖片元素。


目前版本：角色語音已移除，voice.js 不再部署。保留 effects.js 遊戲音效。主選單全幅圖片，遊戲場景使用 assets/game-studio.png，隨 Pages 部署。主頁僅座號姓名；新紀錄 className 固定「翻棋教室」。資源版本 20261113-scene。

更新：準備／遊玩兩階段介面；返回確認保存當局。同步僅在背景執行，不顯示狀態。靜態資源版本 20261113-fullscreen。

新增 music.js 原創 Web Audio 背景音樂，fm-music 獨立記住開關，首次點擊或鍵盤操作後播放；分頁隱藏即暫停，無外部音訊服務。開始挑戰後以返回設定取代開始按鈕，確認離開會保存紀錄。我的紀錄使用照相館背景。資源版本 20261113-music。
