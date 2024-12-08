import path from 'path';
import fs from 'fs';

export async function uploadImages(req, res) {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Không có file nào được tải lên' });
    }
    const uploadedImagesPath = req.files.map(file => path.basename(file.path));
    res.status(201).json({
        message: 'Tải ảnh lên thành công',
        files: uploadedImagesPath
    });
}

export async function viewImage(req, res) {
    const { fileName } = req.params;
    const imagePath = path.join(__dirname, '../uploads', fileName);
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Không tìm thấy hình ảnh');
        }
        res.sendFile(imagePath);
    });
}

export async function deleteImage(req, res) {
    const { fileName } = req.params;
    const imagePath = path.join(__dirname, '../uploads', fileName);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Không tìm thấy hình ảnh' });
        }

        fs.unlink(imagePath, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Xóa ảnh không thành công', error: err.message });
            }
            res.status(200).json({ message: 'Xóa ảnh thành công' });
        });
    });
}