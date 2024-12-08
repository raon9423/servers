import { Sequelize, where } from "sequelize";
import db from "../models";
import { emit } from "nodemon";
const {Op} = Sequelize;
import InsertUserRequest from "../dtos/requests/user/InsertUserRequest";
import ResponseUser from "../dtos/responses/user/ResponseUser";
import argon2 from 'argon2'
import { UserRole } from "../constants";
import jwt from 'jsonwebtoken';

require('dotenv').config();

export async function registerUser(req, res) {
    const { email, phone, password } = req.body;

    if (!email && !phone){
        return res.status(400).json({
            message: 'Cần cung cấp email hoặc phone'
        });
    }
    const condition = {};
    if (email) condition.email = email;
    if (phone) condition.phone = phone;

    const existingUser = await db.User.findOne({
        where: condition
    });

    if(existingUser){
        return res.status(409).json({
            message: 'Email hoặc phone đã tồn tại'
        });
    }
    const hashPassword = password ? await argon2.hash(password) : null;

    const user = await db.User.create({
        ...req.body,
        email,
        phone,
        role: UserRole.USER,
        password: hashPassword
    });

    return res.status(200).json({
        message: 'Thêm mới người dùng thành công!',
        data: new ResponseUser(user)
    });
}

export async function loginUser(req, res) {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
        return res.status(400).json({
            message: 'Cần cung cấp email hoặc phone và password'
        });
    }

    const condition = {};
    if (email) condition.email = email;
    if (phone) condition.phone = phone;

    try {
        const user = await db.User.findOne({
            where: condition
        });

        if (!user) {
            return res.status(404).json({
                message: 'Tên hoặc mật khẩu không chính xác'
            });
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Tên hoặc mật khẩu không chính xác'
            });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                iat: Math.floor(Date.now() / 1000)
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION
            }
        )

        return res.status(200).json({
            message: 'Đăng nhập thành công',
            data: {
                user: new ResponseUser(user),
                token
            }
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình đăng nhập'
        });
    }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, avatar, old_password, new_password } = req.body;

  if (req.user.id != id) {
    return res.status(403).json({
      message: "Không được phép cập nhật thông tin của người dùng khác"
    });
  }

  const user = await db.User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy người dùng" });
  }

  if (old_password && new_password) {
    const passwordValid = await argon2.verify(user.password, old_password);
    if (!passwordValid) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
    }
    user.password = await argon2.hash(new_password); 
    user.password_changed_at = new Date();
  }

  user.name = name || user.name;
  user.avatar = avatar || user.avatar;

  await user.save();

  return res.status(200).json({ message: "Cập nhật người dùng thành công", user });
}

export async function deleteUser(req, res) {
    const { id } = req.params;

    if (req.user.id != id && req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({
            message: "Không được phép xóa người dùng khác"
        });
    }

    const user = await db.User.findByPk(id);
    if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    await user.destroy();

    return res.status(200).json({ message: "Xóa người dùng thành công" });
}