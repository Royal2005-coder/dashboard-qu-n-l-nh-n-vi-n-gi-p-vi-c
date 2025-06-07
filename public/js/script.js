// Global variables for Firebase (will be provided by Canvas runtime)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Firebase Imports (commented out as not fully implemented for this demo)
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
// import { getFirestore, doc, getDoc, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const canvas = document.getElementById('scheduleCanvas');
const ctx = canvas.getContext('2d');
const dateInput = document.getElementById('scheduleDate');
const userIdDisplay = document.getElementById('userIdDisplay');
const scheduleList = document.getElementById('scheduleList');

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// --- Sample Data for all tables (mimicking your CSDL design) ---
// Expanded data to provide a richer demo experience
const sampleData = {
    lichLamViec: [
        { MaLichLamViec: 1, MaNhanVien: 101, NgayLamViec: '2025-06-10', GioBatDau: '08:00', GioKetThuc: '12:00', TrangThai: 'Trống', GhiChu: 'Ca sáng sẵn sàng' },
        { MaLichLamViec: 2, MaNhanVien: 102, NgayLamViec: '2025-06-10', GioBatDau: '13:00', GioKetThuc: '17:00', TrangThai: 'Đã Đặt', GhiChu: 'Đơn hàng #DH001' },
        { MaLichLamViec: 3, MaNhanVien: 103, NgayLamViec: '2025-06-11', GioBatDau: '09:00', GioKetThuc: '18:00', TrangThai: 'Trống', GhiChu: 'Ca cả ngày' },
        { MaLichLamViec: 4, MaNhanVien: 101, NgayLamViec: '2025-06-12', GioBatDau: '07:00', GioKetThuc: '11:00', TrangThai: 'Trống', GhiChu: 'Ca sáng sớm' },
        { MaLichLamViec: 5, MaNhanVien: 104, NgayLamViec: '2025-06-12', GioBatDau: '14:00', GioKetThuc: '17:00', TrangThai: 'Đã Đặt', GhiChu: 'Đơn hàng #DH002' },
        { MaLichLamViec: 6, MaNhanVien: 105, NgayLamViec: '2025-06-13', GioBatDau: '08:30', GioKetThuc: '12:30', TrangThai: 'Trống', GhiChu: 'Ca sáng sẵn sàng' },
        { MaLichLamViec: 7, MaNhanVien: 102, NgayLamViec: '2025-06-13', GioBatDau: '10:00', GioKetThuc: '15:00', TrangThai: 'Trống', GhiChu: 'Ca giữa ngày' },
        { MaLichLamViec: 8, MaNhanVien: 103, NgayLamViec: '2025-06-14', GioBatDau: '09:00', GioKetThuc: '13:00', TrangThai: 'Đã Đặt', GhiChu: 'Đơn hàng #DH003' },
        { MaLichLamViec: 9, MaNhanVien: 101, NgayLamViec: '2025-06-15', GioBatDau: '13:00', GioKetThuc: '17:00', TrangThai: 'Đã Hủy', GhiChu: 'Khách hàng thay đổi lịch' },
        { MaLichLamViec: 10, MaNhanVien: 104, NgayLamViec: '2025-06-16', GioBatDau: '08:00', GioKetThuc: '12:00', TrangThai: 'Trống', GhiChu: 'Sẵn sàng dọn dẹp' },
        { MaLichLamViec: 11, MaNhanVien: 105, NgayLamViec: '2025-06-16', GioBatDau: '13:00', GioKetThuc: '17:00', TrangThai: 'Đã Đặt', GhiChu: 'Đơn hàng #DH004' },
        { MaLichLamViec: 12, MaNhanVien: 101, NgayLamViec: '2025-06-17', GioBatDau: '09:00', GioKetThuc: '13:00', TrangThai: 'Trống', GhiChu: 'Ca sáng trống' },
        { MaLichLamViec: 13, MaNhanVien: 102, NgayLamViec: '2025-06-17', GioBatDau: '14:00', GioKetThuc: '18:00', TrangThai: 'Đã Đặt', GhiChu: 'Đơn hàng #DH005' },
        { MaLichLamViec: 14, MaNhanVien: 103, NgayLamViec: '2025-06-18', GioBatDau: '08:00', GioKetThuc: '12:00', TrangThai: 'Trống', GhiChu: 'Ca nấu ăn' },
        { MaLichLamViec: 15, MaNhanVien: 104, NgayLamViec: '2025-06-18', GioBatDau: '13:00', GioKetThuc: '17:00', TrangThai: 'Đã Đặt', GhiChu: 'Đơn hàng #DH006' },
        { MaLichLamViec: 16, MaNhanVien: 101, NgayLamViec: '2025-06-19', GioBatDau: '09:00', GioKetThuc: '14:00', TrangThai: 'Trống', GhiChu: 'Ca chăm sóc trẻ em' },
        { MaLichLamViec: 17, MaNhanVien: 102, NgayLamViec: '2025-06-19', GioBatDau: '15:00', GioKetThuc: '19:00', TrangThai: 'Trống', GhiChu: 'Ca giặt là' },
        { MaLichLamViec: 18, MaNhanVien: 103, NgayLamViec: '2025-06-20', GioBatDau: '08:00', GioKetThuc: '12:00', TrangThai: 'Đã Đặt', GhiChu: 'Đơn hàng #DH007' },
        { MaLichLamViec: 19, MaNhanVien: 104, NgayLamViec: '2025-06-20', GioBatDau: '13:00', GioKetThuc: '17:00', TrangThai: 'Trống', GhiChu: 'Ca làm vườn' },
        { MaLichLamViec: 20, MaNhanVien: 105, NgayLamViec: '2025-06-21', GioBatDau: '09:00', GioKetThuc: '13:00', TrangThai: 'Đã Hủy', GhiChu: 'Khách hàng thay đổi lịch' },
        { MaLichLamViec: 21, MaNhanVien: 101, NgayLamViec: '2025-06-21', GioBatDau: '14:00', GioKetThuc: '18:00', TrangThai: 'Trống', GhiChu: 'Ca sửa chữa' },
        { MaLichLamViec: 22, MaNhanVien: 102, NgayLamViec: '2025-06-22', GioBatDau: '08:00', GioKetThuc: '12:00', TrangThai: 'Đã Đặt', GhiChu: 'Đơn hàng #DH008' },
        { MaLichLamViec: 23, MaNhanVien: 103, NgayLamViec: '2025-06-22', GioBatDau: '13:00', GioKetThuc: '17:00', TrangThai: 'Trống', GhiChu: 'Ca rửa xe' },
        { MaLichLamViec: 24, MaNhanVien: 104, NgayLamViec: '2025-06-23', GioBatDau: '09:00', GioKetThuc: '13:00', TrangThai: 'Trống', GhiChu: 'Ca chăm sóc thú cưng' },
        { MaLichLamViec: 25, MaNhanVien: 105, NgayLamViec: '2025-06-23', GioBatDau: '14:00', GioKetThuc: '18:00', TrangThai: 'Đã Đặt', GhiChu: 'Đơn hàng #DH009' },
        { MaLichLamViec: 26, MaNhanVien: 101, NgayLamViec: '2025-06-24', GioBatDau: '08:00', GioKetThuc: '12:00', TrangThai: 'Trống', GhiChu: 'Ca đi chợ' },
        { MaLichLamViec: 27, MaNhanVien: 102, NgayLamViec: '2025-06-24', GioBatDau: '13:00', GioKetThuc: '17:00', TrangThai: 'Trống', GhiChu: 'Ca dọn văn phòng' },
        { MaLichLamViec: 28, MaNhanVien: 103, NgayLamViec: '2025-06-25', GioBatDau: '09:00', GioKetThuc: '13:00', TrangThai: 'Đã Đặt', GhiChu: 'Đơn hàng #DH010' },
        { MaLichLamViec: 29, MaNhanVien: 104, NgayLamViec: '2025-06-25', GioBatDau: '14:00', GioKetThuc: '18:00', TrangThai: 'Trống', GhiChu: 'Ca trông nhà' },
        { MaLichLamViec: 30, MaNhanVien: 105, NgayLamViec: '2025-06-26', GioBatDau: '08:00', GioKetThuc: '12:00', TrangThai: 'Trống', GhiChu: 'Ca buổi sáng' },
    ],
    kyNang: [
        { MaKyNang: 1, TenKyNang: 'Dọn dẹp nhà cửa', MoTaKyNang: 'Lau chùi, hút bụi, sắp xếp đồ đạc, làm sạch bề mặt.' },
        { MaKyNang: 2, TenKyNang: 'Nấu ăn', MoTaKyNang: 'Chuẩn bị và nấu các món ăn theo yêu cầu, đảm bảo vệ sinh an toàn thực phẩm.' },
        { MaKyNang: 3, TenKyNang: 'Chăm sóc trẻ em', MoTaKyNang: 'Trông trẻ, cho ăn, chơi đùa, tắm rửa, thay tã.' },
        { MaKyNang: 4, TenKyNang: 'Giặt là', MoTaKyNang: 'Giặt, phơi, là ủi quần áo, phân loại đồ.' },
        { MaKyNang: 5, TenKyNang: 'Chăm sóc người già', MoTaKyNang: 'Hỗ trợ sinh hoạt hàng ngày, trò chuyện, nhắc nhở thuốc.' },
        { MaKyNang: 6, TenKyNang: 'Làm vườn', MoTaKyNang: 'Cắt tỉa cây cối, tưới nước, bón phân, dọn dẹp sân vườn.' },
        { MaKyNang: 7, TenKyNang: 'Sửa chữa cơ bản', MoTaKyNang: 'Sửa chữa nhỏ các thiết bị điện nước, đồ gia dụng.' },
        { MaKyNang: 8, TenKyNang: 'Rửa xe', MoTaKyNang: 'Vệ sinh bên trong và ngoài xe hơi, đánh bóng lốp.' },
        { MaKyNang: 9, TenKyNang: 'Chăm sóc thú cưng', MoTaKyNang: 'Cho ăn, dắt đi dạo, vệ sinh chuồng/khu vực thú cưng.' },
        { MaKyNang: 10, TenKyNang: 'Đi chợ/Mua sắm', MoTaKyNang: 'Mua sắm nhu yếu phẩm, thực phẩm theo danh sách.' },
        { MaKyNang: 11, TenKyNang: 'Dọn dẹp văn phòng', MoTaKyNang: 'Lau dọn bàn ghế, thiết bị, sàn nhà văn phòng.' },
        { MaKyNang: 12, TenKyNang: 'Trông nhà', MoTaKyNang: 'Giữ nhà, kiểm tra an ninh, tưới cây khi chủ vắng.' },
        { MaKyNang: 13, TenKyNang: 'Thú cưng', MoTaKyNang: 'Chăm sóc, dắt đi dạo thú cưng.' },
        { MaKyNang: 14, TenKyNang: 'Quản lý tài sản', MoTaKyNang: 'Kiểm kê và sắp xếp tài sản gia đình.' },
        { MaKyNang: 15, TenKyNang: 'Hỗ trợ sự kiện', MoTaKyNang: 'Hỗ trợ chuẩn bị và dọn dẹp cho các sự kiện nhỏ.' },
    ],
    kyNangNhanVien: [
        { MaKyNangNhanVien: 1, MaNhanVien: 101, MaKyNang: 1, MucDoThanhThao: 'Nâng cao' },
        { MaKyNangNhanVien: 2, MaNhanVien: 101, MaKyNang: 2, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 3, MaNhanVien: 102, MaKyNang: 1, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 4, MaNhanVien: 102, MaKyNang: 3, MucDoThanhThao: 'Nâng cao' },
        { MaKyNangNhanVien: 5, MaNhanVien: 103, MaKyNang: 4, MucDoThanhThao: 'Nâng cao' },
        { MaKyNangNhanVien: 6, MaNhanVien: 103, MaKyNang: 1, MucDoThanhThao: 'Sơ cấp' },
        { MaKyNangNhanVien: 7, MaNhanVien: 104, MaKyNang: 2, MucDoThanhThao: 'Nâng cao' },
        { MaKyNangNhanVien: 8, MaNhanVien: 104, MaKyNang: 5, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 9, MaNhanVien: 105, MaKyNang: 1, MucDoThanhThao: 'Nâng cao' },
        { MaKyNangNhanVien: 10, MaNhanVien: 105, MaKyNang: 4, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 11, MaNhanVien: 101, MaKyNang: 6, MucDoThanhThao: 'Sơ cấp' },
        { MaKyNangNhanVien: 12, MaNhanVien: 102, MaKyNang: 7, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 13, MaNhanVien: 103, MaKyNang: 8, MucDoThanhThao: 'Nâng cao' },
        { MaKyNangNhanVien: 14, MaNhanVien: 104, MaKyNang: 9, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 15, MaNhanVien: 105, MaKyNang: 10, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 16, MaNhanVien: 101, MaKyNang: 11, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 17, MaNhanVien: 102, MaKyNang: 12, MucDoThanhThao: 'Sơ cấp' },
        { MaKyNangNhanVien: 18, MaNhanVien: 103, MaKyNang: 5, MucDoThanhThao: 'Sơ cấp' },
        { MaKyNangNhanVien: 19, MaNhanVien: 104, MaKyNang: 1, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 20, MaNhanVien: 105, MaKyNang: 2, MucDoThanhThao: 'Sơ cấp' },
        { MaKyNangNhanVien: 21, MaNhanVien: 101, MaKyNang: 13, MucDoThanhThao: 'Nâng cao' },
        { MaKyNangNhanVien: 22, MaNhanVien: 102, MaKyNang: 14, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 23, MaNhanVien: 103, MaKyNang: 15, MucDoThanhThao: 'Sơ cấp' },
        { MaKyNangNhanVien: 24, MaNhanVien: 104, MaKyNang: 3, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 25, MaNhanVien: 105, MaKyNang: 6, MucDoThanhThao: 'Nâng cao' },
        { MaKyNangNhanVien: 26, MaNhanVien: 101, MaKyNang: 7, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 27, MaNhanVien: 102, MaKyNang: 8, MucDoThanhThao: 'Nâng cao' },
        { MaKyNangNhanVien: 28, MaNhanVien: 103, MaKyNang: 9, MucDoThanhThao: 'Trung cấp' },
        { MaKyNangNhanVien: 29, MaNhanVien: 104, MaKyNang: 10, MucDoThanhThao: 'Sơ cấp' },
        { MaKyNangNhanVien: 30, MaNhanVien: 105, MaKyNang: 11, MucDoThanhThao: 'Trung cấp' },
    ],
    dichVu: [
        { MaDichVu: 1, TenDichVu: 'Dọn dẹp theo giờ', MoTaDichVu: 'Dịch vụ vệ sinh nhà cửa tính theo giờ.', GiaCoBan: 100000.00, DonViTinh: 'Giờ' },
        { MaDichVu: 2, TenDichVu: 'Nấu ăn gia đình', MoTaDichVu: 'Dịch vụ chuẩn bị các bữa ăn gia đình.', GiaCoBan: 250000.00, DonViTinh: 'Bữa' },
        { MaDichVu: 3, TenDichVu: 'Chăm sóc em bé', MoTaDichVu: 'Dịch vụ trông nom và chăm sóc trẻ nhỏ.', GiaCoBan: 150000.00, DonViTinh: 'Giờ' },
        { MaDichVu: 4, TenDichVu: 'Giặt ủi', MoTaDichVu: 'Dịch vụ giặt, phơi, là ủi quần áo.', GiaCoBan: 80000.00, DonViTinh: 'Kg' },
        { MaDichVu: 5, TenDichVu: 'Tổng vệ sinh nhà cửa', MoTaDichVu: 'Dịch vụ làm sạch tổng thể toàn bộ căn nhà.', GiaCoBan: 500000.00, DonViTinh: 'Lần' },
        { MaDichVu: 6, TenDichVu: 'Chăm sóc người cao tuổi', MoTaDichVu: 'Dịch vụ hỗ trợ và bầu bạn với người già.', GiaCoBan: 180000.00, DonViTinh: 'Giờ' },
        { MaDichVu: 7, TenDichVu: 'Dọn dẹp văn phòng', MoTaDichVu: 'Dịch vụ vệ sinh và sắp xếp không gian làm việc.', GiaCoBan: 120000.00, DonViTinh: 'Giờ' },
        { MaDichVu: 8, TenDichVu: 'Nấu ăn tiệc', MoTaDichVu: 'Dịch vụ nấu ăn cho các buổi tiệc, sự kiện nhỏ.', GiaCoBan: 350000.00, DonViTinh: 'Bữa' },
        { MaDichVu: 9, TenDichVu: 'Chăm sóc thú cưng', MoTaDichVu: 'Dịch vụ cho ăn, dắt đi dạo và vệ sinh cho thú cưng.', GiaCoBan: 120000.00, DonViTinh: 'Lần' },
        { MaDichVu: 10, TenDichVu: 'Sửa chữa gia dụng cơ bản', MoTaDichVu: 'Dịch vụ sửa chữa nhỏ các thiết bị trong nhà.', GiaCoBan: 150000.00, DonViTinh: 'Lần' },
        { MaDichVu: 11, TenDichVu: 'Đi chợ hộ', MoTaDichVu: 'Dịch vụ mua sắm nhu yếu phẩm theo yêu cầu.', GiaCoBan: 70000.00, DonViTinh: 'Lần' },
        { MaDichVu: 12, TenDichVu: 'Dịch vụ trông nhà', MoTaDichVu: 'Dịch vụ giữ nhà, kiểm tra an ninh khi chủ vắng mặt.', GiaCoBan: 200000.00, DonViTinh: 'Ngày' },
        { MaDichVu: 13, TenDichVu: 'Rửa chén đĩa', MoTaDichVu: 'Rửa và sắp xếp chén đĩa, dụng cụ nhà bếp.', GiaCoBan: 50000.00, DonViTinh: 'Lần' },
        { MaDichVu: 14, TenDichVu: 'Vệ sinh sofa/thảm', MoTaDichVu: 'Làm sạch sâu sofa, thảm bằng máy chuyên dụng.', GiaCoBan: 300000.00, DonViTinh: 'Lần' },
        { MaDichVu: 15, TenDichVu: 'Hỗ trợ di chuyển', MoTaDichVu: 'Hỗ trợ đóng gói, sắp xếp đồ đạc khi chuyển nhà.', GiaCoBan: 400000.00, DonViTinh: 'Lần' },
        { MaDichVu: 16, TenDichVu: 'Lau kính cửa sổ', MoTaDichVu: 'Lau sạch kính cửa sổ bên trong và bên ngoài.', GiaCoBan: 100000.00, DonViTinh: 'm2' },
        { MaDichVu: 17, TenDichVu: 'Vệ sinh tủ lạnh', MoTaDichVu: 'Làm sạch và sắp xếp thực phẩm trong tủ lạnh.', GiaCoBan: 80000.00, DonViTinh: 'Lần' },
        { MaDichVu: 18, TenDichVu: 'Đánh bóng sàn nhà', MoTaDichVu: 'Đánh bóng và làm sạch sàn nhà bằng máy.', GiaCoBan: 200000.00, DonViTinh: 'm2' },
        { MaDichVu: 19, TenDichVu: 'Dịch vụ giao hàng', MoTaDichVu: 'Giao nhận các bưu kiện, hàng hóa nhỏ.', GiaCoBan: 40000.00, DonViTinh: 'Lần' },
        { MaDichVu: 20, TenDichVu: 'Trợ lý cá nhân', MoTaDichVu: 'Hỗ trợ các công việc cá nhân, đặt lịch hẹn.', GiaCoBan: 200000.00, DonViTinh: 'Giờ' },
    ],
    donHang: [
        { MaDonHang: 1, MaKhachHang: 1, MaNhanVien: 102, MaDichVu: 5, NgayDatHang: '2025-06-08', GioBatDau: '09:00', GioKetThuc: '17:00', DiaChiDichVu: '123 Lê Lợi, Q.1, TP.HCM', TongTien: 500000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Cần tổng vệ sinh nhà 3 phòng.' },
        { MaDonHang: 2, MaKhachHang: 2, MaNhanVien: 101, MaDichVu: 1, NgayDatHang: '2025-06-08', GioBatDau: '08:00', GioKetThuc: '12:00', DiaChiDichVu: '45 Nguyễn Huệ, Q.1, TP.HCM', TongTien: 400000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Dọn dẹp định kỳ.' },
        { MaDonHang: 3, MaKhachHang: 3, MaNhanVien: 104, MaDichVu: 3, NgayDatHang: '2025-06-09', GioBatDau: '10:00', GioKetThuc: '14:00', DiaChiDichVu: '78 Điện Biên Phủ, Q.Bình Thạnh', TongTien: 600000.00, TrangThaiDonHang: 'Chờ xác nhận', GhiChu: 'Chăm sóc bé 6 tháng tuổi.' },
        { MaDonHang: 4, MaKhachHang: 1, MaNhanVien: null, MaDichVu: 2, NgayDatHang: '2025-06-09', GioBatDau: '18:00', GioKetThuc: '20:00', DiaChiDichVu: '123 Lê Lợi, Q.1, TP.HCM', TongTien: 250000.00, TrangThaiDonHang: 'Chờ xác nhận', GhiChu: 'Nấu bữa tối cho 4 người.' },
        { MaDonHang: 5, MaKhachHang: 4, MaNhanVien: 103, MaDichVu: 4, NgayDatHang: '2025-06-10', GioBatDau: '09:00', GioKetThuc: '10:00', DiaChiDichVu: '20 Bến Nghé, Q.1, TP.HCM', TongTien: 160000.00, TrangThaiDonHang: 'Đã hoàn thành', GhiChu: 'Giặt ủi 2 bộ quần áo.' },
        { MaDonHang: 6, MaKhachHang: 5, MaNhanVien: 105, MaDichVu: 6, NgayDatHang: '2025-06-10', GioBatDau: '13:00', GioKetThuc: '16:00', DiaChiDichVu: '88 Trường Sa, Q.Bình Thạnh', TongTien: 540000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Chăm sóc cụ ông 80 tuổi.' },
        { MaDonHang: 7, MaKhachHang: 2, MaNhanVien: 101, MaDichVu: 1, NgayDatHang: '2025-06-11', GioBatDau: '14:00', GioKetThuc: '17:00', DiaChiDichVu: '45 Nguyễn Huệ, Q.1, TP.HCM', TongTien: 300000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Dọn dẹp phòng khách và bếp.' },
        { MaDonHang: 8, MaKhachHang: 6, MaNhanVien: 102, MaDichVu: 7, NgayDatHang: '2025-06-11', GioBatDau: '08:00', GioKetThuc: '12:00', DiaChiDichVu: '34 Ngô Gia Tự, Q.10, TP.HCM', TongTien: 480000.00, TrangThaiDonHang: 'Đã hoàn thành', GhiChu: 'Vệ sinh văn phòng làm việc.' },
        { MaDonHang: 9, MaKhachHang: 7, MaNhanVien: 104, MaDichVu: 8, NgayDatHang: '2025-06-12', GioBatDau: '19:00', GioKetThuc: '22:00', DiaChiDichVu: '56 Lý Thường Kiệt, Q.10, TP.HCM', TongTien: 350000.00, TrangThaiDonHang: 'Chờ xác nhận', GhiChu: 'Nấu tiệc sinh nhật nhỏ.' },
        { MaDonHang: 10, MaKhachHang: 3, MaNhanVien: 103, MaDichVu: 9, NgayDatHang: '2025-06-12', GioBatDau: '09:00', GioKetThuc: '10:00', DiaChiDichVu: '78 Điện Biên Phủ, Q.Bình Thạnh', TongTien: 120000.00, TrangThaiDonHang: 'Đã hoàn thành', GhiChu: 'Chăm sóc mèo cưng.' },
        { MaDonHang: 11, MaKhachHang: 1, MaNhanVien: 105, MaDichVu: 10, NgayDatHang: '2025-06-13', GioBatDau: '08:00', GioKetThuc: '10:00', DiaChiDichVu: '123 Lê Lợi, Q.1, TP.HCM', TongTien: 150000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Sửa vòi nước bị rò rỉ.' },
        { MaDonHang: 12, MaKhachHang: 4, MaNhanVien: null, MaDichVu: 11, NgayDatHang: '2025-06-13', GioBatDau: '10:00', GioKetThuc: '11:00', DiaChiDichVu: '20 Bến Nghé, Q.1, TP.HCM', TongTien: 70000.00, TrangThaiDonHang: 'Chờ xác nhận', GhiChu: 'Mua sắm rau củ quả.' },
        { MaDonHang: 13, MaKhachHang: 5, MaNhanVien: 101, MaDichVu: 12, NgayDatHang: '2025-06-14', GioBatDau: '09:00', GioKetThuc: '17:00', DiaChiDichVu: '88 Trường Sa, Q.Bình Thạnh', TongTien: 200000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Trông nhà và tưới cây.' },
        { MaDonHang: 14, MaKhachHang: 6, MaNhanVien: 102, MaDichVu: 1, NgayDatHang: '2025-06-14', GioBatDau: '13:00', GioKetThuc: '16:00', DiaChiDichVu: '34 Ngô Gia Tự, Q.10, TP.HCM', TongTien: 300000.00, TrangThaiDonHang: 'Đã Hủy', GhiChu: 'Khách hàng thay đổi lịch đột xuất.' },
        { MaDonHang: 15, MaKhachHang: 7, MaNhanVien: 103, MaDichVu: 3, NgayDatHang: '2025-06-15', GioBatDau: '10:00', GioKetThuc: '12:00', DiaChiDichVu: '56 Lý Thường Kiệt, Q.10, TP.HCM', TongTien: 300000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Chăm sóc bé 3 tuổi.' },
        { MaDonHang: 16, MaKhachHang: 1, MaNhanVien: 104, MaDichVu: 4, NgayDatHang: '2025-06-15', GioBatDau: '15:00', GioKetThuc: '16:00', DiaChiDichVu: '123 Lê Lợi, Q.1, TP.HCM', TongTien: 80000.00, TrangThaiDonHang: 'Chờ xác nhận', GhiChu: 'Giặt ủi 1 túi đồ.' },
        { MaDonHang: 17, MaKhachHang: 2, MaNhanVien: 105, MaDichVu: 5, NgayDatHang: '2025-06-16', GioBatDau: '09:00', GioKetThuc: '17:00', DiaChiDichVu: '45 Nguyễn Huệ, Q.1, TP.HCM', TongTien: 500000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Tổng vệ sinh sau tiệc.' },
        { MaDonHang: 18, MaKhachHang: 3, MaNhanVien: 101, MaDichVu: 13, NgayDatHang: '2025-06-17', GioBatDau: '10:00', GioKetThuc: '11:00', DiaChiDichVu: '78 Điện Biên Phủ, Q.Bình Thạnh', TongTien: 50000.00, TrangThaiDonHang: 'Đã hoàn thành', GhiChu: 'Rửa chén đĩa sau bữa sáng.' },
        { MaDonHang: 19, MaKhachHang: 4, MaNhanVien: 102, MaDichVu: 14, NgayDatHang: '2025-06-18', GioBatDau: '13:00', GioKetThuc: '16:00', DiaChiDichVu: '20 Bến Nghé, Q.1, TP.HCM', TongTien: 300000.00, TrangThaiDonHang: 'Chờ xác nhận', GhiChu: 'Vệ sinh sofa phòng khách.' },
        { MaDonHang: 20, MaKhachHang: 5, MaNhanVien: 103, MaDichVu: 15, NgayDatHang: '2025-06-19', GioBatDau: '08:00', GioKetThuc: '17:00', DiaChiDichVu: '88 Trường Sa, Q.Bình Thạnh', TongTien: 400000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Hỗ trợ đóng gói chuyển nhà.' },
        { MaDonHang: 21, MaKhachHang: 6, MaNhanVien: 104, MaDichVu: 16, NgayDatHang: '2025-06-20', GioBatDau: '09:00', GioKetThuc: '11:00', DiaChiDichVu: '34 Ngô Gia Tự, Q.10, TP.HCM', TongTien: 200000.00, TrangThaiDonHang: 'Đã hoàn thành', GhiChu: 'Lau kính ban công.' },
        { MaDonHang: 22, MaKhachHang: 7, MaNhanVien: 105, MaDichVu: 17, NgayDatHang: '2025-06-21', GioBatDau: '14:00', GioKetThuc: '15:00', DiaChiDichVu: '56 Lý Thường Kiệt, Q.10, TP.HCM', TongTien: 80000.00, TrangThaiDonHang: 'Chờ xác nhận', GhiChu: 'Vệ sinh tủ lạnh.' },
        { MaDonHang: 23, MaKhachHang: 1, MaNhanVien: 101, MaDichVu: 18, NgayDatHang: '2025-06-22', GioBatDau: '10:00', GioKetThuc: '12:00', DiaChiDichVu: '123 Lê Lợi, Q.1, TP.HCM', TongTien: 400000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Đánh bóng sàn gỗ phòng khách.' },
        { MaDonHang: 24, MaKhachHang: 2, MaNhanVien: 102, MaDichVu: 19, NgayDatHang: '2025-06-23', GioBatDau: '08:00', GioKetThuc: '09:00', DiaChiDichVu: '45 Nguyễn Huệ, Q.1, TP.HCM', TongTien: 40000.00, TrangThaiDonHang: 'Đã hoàn thành', GhiChu: 'Giao tài liệu đến công ty.' },
        { MaDonHang: 25, MaKhachHang: 3, MaNhanVien: 103, MaDichVu: 20, NgayDatHang: '2025-06-24', GioBatDau: '13:00', GioKetThuc: '15:00', DiaChiDichVu: '78 Điện Biên Phủ, Q.Bình Thạnh', TongTien: 400000.00, TrangThaiDonHang: 'Chờ xác nhận', GhiChu: 'Trợ lý sắp xếp lịch hẹn.' },
        { MaDonHang: 26, MaKhachHang: 4, MaNhanVien: 104, MaDichVu: 1, NgayDatHang: '2025-06-25', GioBatDau: '09:00', GioKetThuc: '13:00', DiaChiDichVu: '20 Bến Nghé, Q.1, TP.HCM', TongTien: 400000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Dọn dẹp nhà sau buổi tiệc.' },
        { MaDonHang: 27, MaKhachHang: 5, MaNhanVien: 105, MaDichVu: 2, NgayDatHang: '2025-06-26', GioBatDau: '18:00', GioKetThuc: '20:00', DiaChiDichVu: '88 Trường Sa, Q.Bình Thạnh', TongTien: 250000.00, TrangThaiDonHang: 'Chờ xác nhận', GhiChu: 'Nấu ăn tối kiểu Ý.' },
        { MaDonHang: 28, MaKhachHang: 6, MaNhanVien: 101, MaDichVu: 3, NgayDatHang: '2025-06-27', GioBatDau: '10:00', GioKetThuc: '14:00', DiaChiDichVu: '34 Ngô Gia Tự, Q.10, TP.HCM', TongTien: 600000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Chăm sóc bé sơ sinh.' },
        { MaDonHang: 29, MaKhachHang: 7, MaNhanVien: 102, MaDichVu: 4, NgayDatHang: '2025-06-28', GioBatDau: '09:00', GioKetThuc: '10:30', DiaChiDichVu: '56 Lý Thường Kiệt, Q.10, TP.HCM', TongTien: 120000.00, TrangThaiDonHang: 'Chờ xác nhận', GhiChu: 'Giặt ủi quần áo trẻ em.' },
        { MaDonHang: 30, MaKhachHang: 1, MaNhanVien: 103, MaDichVu: 5, NgayDatHang: '2025-06-29', GioBatDau: '09:00', GioKetThuc: '17:00', DiaChiDichVu: '123 Lê Lợi, Q.1, TP.HCM', TongTien: 500000.00, TrangThaiDonHang: 'Đang xử lý', GhiChu: 'Tổng vệ sinh định kỳ hàng tháng.' },
    ],
    // Assuming NHANVIEN and KHACHHANG for lookup purposes (simplified)
    nhanVienLookup: {
        101: 'Nguyễn Văn A',
        102: 'Trần Thị B',
        103: 'Lê Văn C',
        104: 'Phạm Thị D',
        105: 'Hoàng Văn E',
        106: 'Vũ Thị F',
        107: 'Đỗ Văn G',
        108: 'Ngô Thị H',
        109: 'Bùi Văn I',
        110: 'Lâm Thị K'
    },
    khachHangLookup: {
        1: 'Nguyễn Thanh Tùng',
        2: 'Trần Thị Thuỷ',
        3: 'Phạm Minh Quang',
        4: 'Đặng Mai Phương',
        5: 'Vũ Quốc Anh',
        6: 'Lý Kim Ngân',
        7: 'Dương Thành Công',
        8: 'Hoàng Minh Tuấn',
        9: 'Nguyễn Thị Bích'
    }
};

// --- Functions for drawing and rendering data ---

// Function to draw schedule on canvas
function drawSchedule(selectedDate) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size for responsiveness
    const containerWidth = canvas.clientWidth;
    canvas.width = containerWidth;
    canvas.height = Math.min(containerWidth * 0.7, 450); // Maintain aspect ratio, slightly increased max height

    const margin = 25; // Increased margin
    const itemHeight = 45; // Slightly taller items
    const headerHeight = 40; // Taller header
    let currentY = margin + headerHeight;

    ctx.font = '500 17px Inter'; // Bolder font for schedule items
    ctx.textBaseline = 'middle';

    // Draw header
    ctx.fillStyle = '#3b82f6'; // Primary blue for header
    ctx.fillRect(0, 0, canvas.width, headerHeight);
    ctx.fillStyle = '#ffffff'; // White text
    ctx.textAlign = 'center';
    ctx.fillText(`Lịch làm việc ngày: ${selectedDate}`, canvas.width / 2, headerHeight / 2);

    ctx.textAlign = 'left'; // Reset text alignment

    // Filter data for the selected date
    const dailySchedule = sampleData.lichLamViec.filter(item => item.NgayLamViec === selectedDate);
    scheduleList.innerHTML = ''; // Clear previous details

    if (dailySchedule.length === 0) {
        ctx.fillStyle = '#64748b'; // Slightly darker grey for no data text
        ctx.fillText('Không có lịch làm việc cho ngày này.', margin, currentY + itemHeight / 2);
        const li = document.createElement('li');
        li.textContent = 'Không có lịch làm việc chi tiết cho ngày này.';
        scheduleList.appendChild(li);
    } else {
        dailySchedule.forEach((item, index) => {
            const y = currentY + (index * itemHeight);
            const backgroundColor = item.TrangThai === 'Đã Đặt' ? '#93c5fd' : // Light blue for booked
                                    item.TrangThai === 'Đã Hủy' ? '#fca5a5' : // Light red for cancelled
                                    '#a7f3d0'; // Light green for available

            ctx.fillStyle = backgroundColor;
            ctx.fillRect(margin, y, canvas.width - (2 * margin), itemHeight - 7); // Subtract 7 for better spacing

            ctx.fillStyle = '#1e293b'; // Very dark text color for contrast
            // Ensure text fits within the canvas width
            let text = `NV ${item.MaNhanVien} | ${item.GioBatDau} - ${item.GioKetThuc} | ${item.TrangThai}`;
            if (item.GhiChu) {
                 text += ` | ${item.GhiChu}`;
            }
            // Adjust font size if text is too long (basic handling)
            ctx.font = '500 17px Inter';
            if (ctx.measureText(text).width > (canvas.width - (2 * margin) - 20)) {
                ctx.font = '500 15px Inter'; // Reduce font size if text is too wide
            }
            ctx.fillText(text, margin + 12, y + (itemHeight - 7) / 2);

            // Add details to the list below the canvas
            const li = document.createElement('li');
            li.textContent = `Mã LV: ${item.MaLichLamViec}, NV: ${item.MaNhanVien} (${sampleData.nhanVienLookup[item.MaNhanVien] || 'N/A'}), Từ: ${item.GioBatDau}, Đến: ${item.GioKetThuc}, Trạng thái: ${item.TrangThai}, Ghi chú: ${item.GhiChu || 'Không có'}`;
            scheduleList.appendChild(li);
        });
    }
}

// Function to render data into HTML tables
function renderTable(tableId, data, headers) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach(item => {
        const row = tableBody.insertRow();
        headers.forEach(key => {
            const cell = row.insertCell();
            let cellValue = item[key];
            // Special handling for foreign keys to display meaningful names
            if (tableId === 'donHangTable' && key === 'MaNhanVien') {
                cellValue = item[key] ? `${item[key]} (${sampleData.nhanVienLookup[item[key]] || 'N/A'})` : 'Chưa phân công';
            } else if (tableId === 'donHangTable' && key === 'MaKhachHang') {
                cellValue = `${item[key]} (${sampleData.khachHangLookup[item[key]] || 'N/A'})`;
            } else if (tableId === 'donHangTable' && key === 'MaDichVu') {
                const dichVu = sampleData.dichVu.find(d => d.MaDichVu === item[key]);
                cellValue = `${item[key]} (${dichVu ? dichVu.TenDichVu : 'N/A'})`;
            } else if (tableId === 'kynangNhanVienTable' && key === 'MaNhanVien') {
                 cellValue = `${item[key]} (${sampleData.nhanVienLookup[item[key]] || 'N/A'})`;
            } else if (tableId === 'kynangNhanVienTable' && key === 'MaKyNang') {
                 const kyNang = sampleData.kyNang.find(k => k.MaKyNang === item[key]);
                 cellValue = `${item[key]} (${kyNang ? kyNang.TenKyNang : 'N/A'})`;
            } else if (typeof cellValue === 'number' && key.includes('Tien')) { // Format currency
                cellValue = `${cellValue.toLocaleString('vi-VN')} VNĐ`;
            } else if (cellValue === null) {
                cellValue = 'N/A';
            }
            cell.textContent = cellValue;
        });
    });
}

// --- Event Listeners and Initial Setup ---

// Tab switching logic
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and add to clicked button
        tabButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });
        button.classList.add('active', 'bg-blue-500', 'text-white');
        button.classList.remove('bg-gray-200', 'text-gray-700');

        // Hide all tab contents and show the selected one
        tabContents.forEach(content => content.classList.add('hidden'));
        document.getElementById(`${button.dataset.tab}-content`).classList.remove('hidden');

        // Re-draw canvas if switching back to 'lichlamviec' tab
        if (button.dataset.tab === 'lichlamviec') {
            drawSchedule(dateInput.value);
        }
    });
});

// Set initial date to today for date picker
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const dd = String(today.getDate()).padStart(2, '0');
const defaultDate = `${yyyy}-${mm}-${dd}`;
dateInput.value = defaultDate;

// Event listener for date changes on the schedule tab
dateInput.addEventListener('change', (event) => {
    drawSchedule(event.target.value);
});

// Handle window resize to redraw canvas
window.addEventListener('resize', () => {
    // Only redraw if the 'lichlamviec' tab is active
    if (!document.getElementById('lichlamviec-content').classList.contains('hidden')) {
        drawSchedule(dateInput.value);
    }
});

// Initial render on page load
window.onload = function() {
    // Display App ID (or User ID if Firebase integrated)
    userIdDisplay.textContent = `App ID: ${appId}`;
    // If using Firebase authentication:
    // if (typeof firebaseConfig.apiKey !== 'undefined' && firebaseConfig.apiKey !== '') {
    //     const app = initializeApp(firebaseConfig);
    //     const auth = getAuth(app);
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             userIdDisplay.textContent = `User ID: ${user.uid}`;
    //         } else {
    //             userIdDisplay.textContent = `User ID: Anonymous (Sign in required)`;
    //             // Optional: sign in anonymously if no token
    //             // signInAnonymously(auth);
    //         }
    //     });
    //     if (initialAuthToken) {
    //         signInWithCustomToken(auth, initialAuthToken).catch(error => {
    //             console.error("Error signing in with custom token:", error);
    //             signInAnonymously(auth);
    //         });
    //     } else {
    //         signInAnonymously(auth);
    //     }
    // } else {
    //     userIdDisplay.textContent = `User ID: Anonymous (No Firebase Config)`;
    // }

    // Initial draw for the Lich Lam Viec tab
    drawSchedule(defaultDate);

    // Render all other tables initially (they will be hidden by default until their tab is clicked)
    renderTable('kynangTable', sampleData.kyNang, ['MaKyNang', 'TenKyNang', 'MoTaKyNang']);
    renderTable('kynangNhanVienTable', sampleData.kyNangNhanVien, ['MaKyNangNhanVien', 'MaNhanVien', 'MaKyNang', 'MucDoThanhThao']);
    renderTable('dichVuTable', sampleData.dichVu, ['MaDichVu', 'TenDichVu', 'MoTaDichVu', 'GiaCoBan', 'DonViTinh']);
    renderTable('donHangTable', sampleData.donHang, ['MaDonHang', 'MaKhachHang', 'MaNhanVien', 'MaDichVu', 'NgayDatHang', 'GioBatDau', 'GioKetThuc', 'DiaChiDichVu', 'TongTien', 'TrangThaiDonHang', 'GhiChu']);
}; 