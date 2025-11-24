import { Product } from "../models/Product.model.js";

export const createProduct = async (req, res) => {
    try {
        // Lấy dữ liệu
        const { name, price, description } = req.body

        // Kiểm tra dữ liệu
        if(!name || !price || !description) {
            return res.status(401).json({ message: 'Thiếu dữ liệu khi tạo sản phẩm!' })
        }

        // Tạo sản phẩm
        const product = await Product.create({
            name: name,
            price: price,
            description: description,
            createdBy: req.user.id
        })

        res.status(201).json({
            message: 'Tạo sản phẩm thành công!',
            product: product
        })
    } catch (error) {
        console.erorr('Lỗi tạo sản phẩm: ', error);
        res.status(500).json({ message: 'Lỗi server khi tạo sản phẩm!' })
    }
}

export const getAllProducts = async (req, res) => {
    try {
        // truy vấn
        const allProducts = await Product.find()
        res.status(200).json({
            message: 'Trả về danh sách sản phẩm thành công!',
            product: allProducts
        })
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi truy vấn sản phẩm' })
    }

}

export const getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        }
        res.status(200).json({
            message: 'Tìm thấy thành công',
            product: product
        })
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tìm kiếm sản phẩm'})
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, description },
            { new: true } // trả về bản mới nhất
        )

        if(!product) {
            res.status(404).json({ message: 'Không thể tìm thấy sản phẩm để update!' })
        }

        res.status(200).json({
            message: 'Update sản phẩm thành công',
            product: product
        })
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi update sản phẩm' })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if(!product) {
            res.status(404).json({ message: 'Không thể tìm thấy sản phẩm để xóa!' })
        }

        res.status(200).json({
            message: 'Đã xóa sản phẩm thành công',
            product: product
        })
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm!' })
    }
}