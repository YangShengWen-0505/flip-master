# 00_LOCAL.md — 專案本機速查
## 專案狀態
Flip Master，原生網頁；2026-11-13 建立。GitHub Pages 既有版本已上線；本次 Google 接收服務待授權與部署。
## 服務與平台
GitHub: YangShengWen-0505/flip-master；Pages 靜態部署。改用 Google Apps Script 與私人試算表。
## 帳號與憑證參照
Git credential 可推送；Google 部署需帳戶授權。學生課堂碼與老師管理密碼由 setup 產生，僅存在私人試算表及 Script Properties。
## 設定、建置與發行
無建置依賴。python -m http.server 8080。main 推送由 .github/workflows/pages.yml 部署，先設定 Pages Source 為 GitHub Actions。
## 資料、備份與復原
離線 localStorage，JSON 匯出匯入備份。清除瀏覽器會失去離線紀錄。老師彙整和學生紀錄分開儲存。sync.js 自動重試與收件確認；Google 接收端使用寫入憑證與老師讀取密碼。
## 費用、續約與外部期限
未開通付費服務。學生請用座號或暱稱；公開 repository 不放學生資料。
## 待確認事項
Google 初始化授權、Web App 部署與跨裝置測試。
## 參考資料與更新
README.md、GOOGLE_SETUP.md、google-apps-script/Code.gs。2026-11-13 改為免帳號課堂自動收集。
