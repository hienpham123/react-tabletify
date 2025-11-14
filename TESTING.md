# Testing Guide - ReactTabletify

## Cách Test Row Actions Menu

### 1. Test Thủ Công (Manual Testing)

Chạy development server và test trực tiếp trên browser:

```bash
npm start
```

Sau đó mở browser tại `http://localhost:3000` và test các tính năng sau:

#### ✅ Test Cases:

1. **Hiển thị Row Actions Button**
   - ✅ Kiểm tra button 3 dots (⋮) xuất hiện ở cột cuối cùng
   - ✅ Button chỉ hiển thị khi có `rowActions` prop

2. **Mở/Đóng Menu**
   - ✅ Click vào button 3 dots → Menu dropdown xuất hiện
   - ✅ Click lại button → Menu đóng
   - ✅ Click bên ngoài menu → Menu tự động đóng
   - ✅ Nhấn phím `Escape` → Menu đóng

3. **Actions trong Menu**
   - ✅ Tất cả actions được hiển thị đúng label
   - ✅ Click vào action → `onClick` được gọi với đúng `item` và `index`
   - ✅ Sau khi click action → Menu tự động đóng

4. **Disabled Actions**
   - ✅ Actions có `disabled: true` hiển thị với opacity thấp hơn
   - ✅ Click vào disabled action → Không gọi `onClick`
   - ✅ Disabled action không thể click được

5. **Icons (nếu có)**
   - ✅ Icons hiển thị bên trái label
   - ✅ Icons có kích thước phù hợp

6. **Positioning**
   - ✅ Menu tự động position (trên/dưới button) dựa vào không gian có sẵn
   - ✅ Menu không bị cắt bởi viewport

7. **Multiple Rows**
   - ✅ Mỗi row có button riêng
   - ✅ Chỉ một menu mở tại một thời điểm
   - ✅ Mở menu row khác → Menu row cũ tự động đóng

8. **Integration với các tính năng khác**
   - ✅ Row Actions hoạt động cùng với Row Selection
   - ✅ Row Actions hoạt động cùng với Row Drag & Drop
   - ✅ Row Actions hoạt động cùng với Inline Editing
   - ✅ Row Actions column sticky khi scroll (nếu có pinned columns)

### 2. Test Tự Động (Automated Testing)

Chạy test suite:

```bash
npm test
```

#### Test Files:

- `src/components/__tests__/RowActionsMenu.test.tsx` - Test RowActionsMenu component
- `src/components/__tests__/RowActionsCell.test.tsx` - Test RowActionsCell component

#### Test Coverage:

✅ **RowActionsMenu Tests:**
- Renders menu with actions
- Calls onClick when action is clicked
- Calls onDismiss when action is clicked
- Disables disabled actions
- Does not call onClick for disabled actions
- Closes menu when clicking outside
- Closes menu when pressing Escape
- Does not render when anchorRef is null
- Does not render when actions array is empty

✅ **RowActionsCell Tests:**
- Renders action button when actions are provided
- Calls onMenuToggle when button is clicked
- Stops propagation on click
- Applies active class when menu is open
- Renders empty cell when no actions provided
- Has correct aria attributes

### 3. Test trong App.tsx

File `src/App.tsx` đã được cập nhật với `rowActions` prop để test:

```tsx
rowActions={(item, index) => [
  {
    key: 'edit',
    label: 'Edit',
    onClick: (item, index) => {
      console.log('Edit clicked:', item);
      alert(`Edit: ${item.name}`);
    },
  },
  {
    key: 'duplicate',
    label: 'Duplicate',
    onClick: (item, index) => {
      // Duplicate logic
    },
  },
  {
    key: 'delete',
    label: 'Delete',
    onClick: (item, index) => {
      // Delete logic
    },
    disabled: item.status === 'Active', // Test disabled state
  },
]}
```

### 4. Test Checklist

- [ ] Button 3 dots xuất hiện ở mỗi row
- [ ] Click button mở menu
- [ ] Menu hiển thị đúng các actions
- [ ] Click action gọi đúng callback
- [ ] Menu đóng sau khi click action
- [ ] Click outside đóng menu
- [ ] Press Escape đóng menu
- [ ] Disabled actions không thể click
- [ ] Icons hiển thị đúng (nếu có)
- [ ] Menu positioning đúng
- [ ] Chỉ một menu mở tại một thời điểm
- [ ] Hoạt động với các tính năng khác

### 5. Debug Tips

Nếu có vấn đề, kiểm tra:

1. **Console Logs:**
   ```javascript
   // Trong App.tsx, các onClick callbacks đã có console.log
   // Kiểm tra console để xem callbacks có được gọi không
   ```

2. **React DevTools:**
   - Kiểm tra props của `ReactTabletify`
   - Kiểm tra state `openMenuKey`
   - Kiểm tra `rowActions` function có return đúng array không

3. **CSS Issues:**
   - Kiểm tra `row-actions.css` đã được import chưa
   - Kiểm tra z-index của menu (phải > 1000)
   - Kiểm tra positioning của menu

4. **TypeScript Errors:**
   - Kiểm tra types trong `src/types/index.ts`
   - Đảm bảo `rowActions` prop có đúng type

### 6. Performance Testing

- Test với 100+ rows → Menu vẫn mở/đóng mượt mà
- Test với nhiều actions (10+) → Menu scroll được
- Test với nhiều tables cùng lúc → Không conflict state

