# 00_LOCAL.md — 專案本機速查
## 專案狀態
Flip Master，原生網頁；2026-11-13 建立。部署狀態待確認。
## 服務與平台
GitHub: YangShengWen-0505/flip-master；Pages 靜態部署。Supabase 雲端尚未配置。
## 帳號與憑證參照
gh 尚未登入；Supabase 需公開 anon key 與師生 Auth 帳號。密碼與登入 token 不寫入檔案。
## 設定、建置與發行
無建置依賴。python -m http.server 8080。main 推送由 .github/workflows/pages.yml 部署，先設定 Pages Source 為 GitHub Actions。
## 資料、備份與復原
離線 localStorage，JSON 匯出匯入備份。清除瀏覽器會失去離線紀錄。老師彙整和學生紀錄分開儲存。雲端需手動上傳；supabase.sql 提供權限政策。
## 費用、續約與外部期限
未開通付費服務。學生請用座號或暱稱；公開 repository 不放學生資料。
## 待確認事項
GitHub 推送與 Pages 啟用；Supabase 專案與師生帳號。
## 參考資料與更新
README.md、DESIGN.md、supabase.sql。初版新增遊戲、紀錄、彙整、部署工作流程。
