import jwt from "jsonwebtoken"
import db from '../models'
const JWT_SECRET = process.env.JWT_SECRET;

async function getUserFromToken(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Không có token được cung cấp');
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
        throw new Error('Người dùng không tồn tại');
    }
    
    if (user.password_changed_at && decoded.iat < new Date(user.password_changed_at).getTime() / 1000) {
        throw new Error('Token không hợp lệ do mật khẩu đã thay đổi');
    }
    
    return user; 
}

export default getUserFromToken;