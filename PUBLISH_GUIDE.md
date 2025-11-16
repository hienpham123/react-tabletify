# Hướng dẫn Publish Package lên NPM

## 1. Cấu hình NPM Account

Nếu chưa có tài khoản npm:
1. Đăng ký tại: https://www.npmjs.com/signup
2. Xác thực email

## 2. Đăng nhập NPM từ Terminal

```bash
npm login
```

Nhập username, password, và email của bạn.

## 3. Kiểm tra Package đã sẵn sàng

```bash
# Build package
npm run build

# Kiểm tra files sẽ được publish
npm pack --dry-run
```

## 4. Publish Package

### Cách 1: Publish thủ công

```bash
# Build trước
npm run build

# Publish
npm publish --access public
```

### Cách 2: Sử dụng script có sẵn (tự động build, update version, commit, push)

```bash
npm run publish:all
```

**Lưu ý:** Script này sẽ:
- Build package
- Tự động tăng version
- Commit và push lên GitHub
- Publish lên npm

## 5. Kiểm tra Package trên NPM

Sau khi publish thành công, package sẽ hiển thị tại:
- https://www.npmjs.com/package/react-tabletify

## 6. Cập nhật Version cho lần publish tiếp theo

### Cách 1: Sử dụng npm version

```bash
# Patch version (0.2.5 -> 0.2.6)
npm version patch

# Minor version (0.2.5 -> 0.3.0)
npm version minor

# Major version (0.2.5 -> 1.0.0)
npm version major
```

Sau đó:
```bash
git push --follow-tags
npm publish --access public
```

### Cách 2: Sử dụng script có sẵn

```bash
npm run publish:all
```

## 7. Về GitHub Permissions (Clone nhưng không Push)

**Mặc định, GitHub repository public đã được cấu hình đúng:**

✅ **Cho phép (Mọi người):**
- **Clone** code: `git clone https://github.com/hienpham123/react-tabletify.git`
- **View** code trên GitHub
- **Fork** repository
- **Tạo Issues** để báo lỗi hoặc đề xuất tính năng
- **Tạo Pull Requests** để đóng góp code (sau khi fork)

❌ **Không cho phép (Chỉ Owner/Collaborators):**
- **Push** code trực tiếp vào repository
- **Merge** Pull Requests (chỉ owner/collaborators mới merge được)
- **Delete** branches
- **Change** repository settings

**Cách hoạt động:**
1. Mọi người có thể clone và sử dụng code
2. Nếu muốn đóng góp, họ phải:
   - Fork repository về tài khoản của họ
   - Tạo branch mới và commit changes
   - Tạo Pull Request từ fork của họ về repository gốc
   - Bạn (owner) sẽ review và merge nếu đồng ý

**Để đảm bảo an toàn hơn:**
1. Vào GitHub repository: https://github.com/hienpham123/react-tabletify
2. Settings → General → Features
   - Đảm bảo "Allow merge commits", "Allow squash merging", "Allow rebase merging" được bật
3. Settings → Branches → Add branch protection rule cho branch `main`
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings

## 8. Cấu hình GitHub Repository

Đảm bảo repository có:
- ✅ README.md (đã có)
- ✅ LICENSE file (nên thêm nếu chưa có)
- ✅ .gitignore (đã có)
- ✅ Description và topics trên GitHub

## 9. Tạo GitHub Release (Tùy chọn nhưng khuyến khích)

Khi publish version mới, nên tạo GitHub Release:

1. Vào GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v0.2.5`
4. Release title: `v0.2.5`
5. Description: Copy từ CHANGELOG hoặc README
6. Publish release

## 10. Badges cho README (Tùy chọn)

Có thể thêm badges vào README.md:

```markdown
![npm version](https://img.shields.io/npm/v/react-tabletify)
![npm downloads](https://img.shields.io/npm/dm/react-tabletify)
![GitHub stars](https://img.shields.io/github/stars/hienpham123/react-tabletify)
![License](https://img.shields.io/npm/l/react-tabletify)
```

## Troubleshooting

### Lỗi: "You do not have permission to publish"
- Kiểm tra đã đăng nhập npm chưa: `npm whoami`
- Kiểm tra package name có bị trùng không
- Thử publish với scope: `npm publish --access public`

### Lỗi: "Package name already exists"
- Package name `react-tabletify` đã bị sử dụng
- Cần đổi tên trong package.json hoặc sử dụng scope: `@yourusername/react-tabletify`

### Lỗi: "You cannot publish over the previously published versions"
- Version đã tồn tại trên npm
- Cần tăng version trong package.json

