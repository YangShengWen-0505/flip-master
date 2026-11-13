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
