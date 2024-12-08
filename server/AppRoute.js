import express from "express";
const route = express.Router();
import * as ProductController from './controller/ProductController';
import * as CategoryController from './controller/CategoryController';
import * as BrandController from './controller/BrandController';
import * as OrderController from './controller/OrderController';
import * as UserController from './controller/UserController';
import * as OrderDetailController from './controller/OrderDetailController';
import * as NewController from './controller/NewController';
import * as NewDetailController from './controller/NewDetailController';
import * as BannerController from "./controller/BannerController";
import * as BannerDetailController from "./controller/BannerDetailController";
import * as ImageController from "./controller/ImageController";
import * as ProductImageController from "./controller/ProductImageController";
import * as CartController from "./controller/CartController";
import * as CartItemController from "./controller/CartItemController";
import * as OtpController from "./controller/OtpController"
import * as PaymentController from './controller/PaymentController.js';
import asyncHandler from "./middleware/asyncHandler";
import validate from "./middleware/validate";
import uploadImageMiddleware from "./middleware/imageUpload";
import InsertProductRequest from './dtos/requests/products/InsertProductRequest';
import UpdateProductRequest from "./dtos/requests/products/UpdateProductRequest";
import InsertOrderRequest from "./dtos/requests/order/InsertOrderRequest";
import InsertUserRequest from "./dtos/requests/user/InsertUserRequest";
import LoginUserRequest from "./dtos/requests/user/LoginUserRequest";
import InsertNewsRequest from "./dtos/requests/news/InsertNewRequest";
import UpdateNewRequest from "./dtos/requests/news/UpdateNewRequest";
import InsertBannerRequest from "./dtos/requests/banner/InsertBannerRequest";
import InsertBannerDetailRequest from "./dtos/requests/bannerdetail/InsertBannerDetailRequest";
import InsertProductImageRequest from "./dtos/requests/productimage/InsertProductImageRequest";
import InsertCartsRequest from "./dtos/requests/cart/InsertCartsRequest";
import InsertCartItemsRequest from "./dtos/requests/cartitem/InsertCartItemsRequest";
import requireRoles from "./middleware/jwt";
import { UserRole } from "./constants";

export function AppRoute(app) {
    route.post('/users/register', validate(InsertUserRequest), asyncHandler(UserController.registerUser));
    route.post('/users/login', validate(LoginUserRequest), asyncHandler(UserController.loginUser));
    route.post('/users/:id', requireRoles([UserRole.USER, UserRole.ADMIN]), asyncHandler(UserController.updateUser));
    route.delete('/users/:id', requireRoles([UserRole.ADMIN]), asyncHandler(UserController.deleteUser));

    route.get('/news', asyncHandler(NewController.getNews));
    route.get('/news/:id', asyncHandler(NewController.getNewsById));
    route.post('/news', requireRoles([UserRole.ADMIN]), validate(InsertNewsRequest), asyncHandler(NewController.insertNews)); 
    route.put('/news/:id', requireRoles([UserRole.ADMIN]), validate(UpdateNewRequest), asyncHandler(NewController.updateNews)); 
    route.delete('/news/:id', asyncHandler(NewController.deleteNews));
    //route.delete('/news/:id', requireRoles([UserRole.ADMIN]), asyncHandler(NewController.deleteNews));

    route.get('/carts', asyncHandler(CartController.getCarts));
    route.get('/carts/:id', asyncHandler(CartController.getCartById));
    // route.post('/carts', requireRoles([UserRole.ADMIN, UserRole.USER]), validate(InsertCartsRequest), asyncHandler(CartController.insertCart));
    route.post('/carts', validate(InsertCartsRequest), asyncHandler(CartController.insertCart));
    route.post('/carts/checkout', asyncHandler(CartController.checkoutCart));
    route.put('/carts/:id', requireRoles([UserRole.ADMIN]), asyncHandler(CartController.updateCart));
    route.delete('/carts/:id', requireRoles([UserRole.ADMIN]), asyncHandler(CartController.deleteCart));

    route.get('/cartitems', asyncHandler(CartItemController.getCartItems));
    route.get('/cartitems/carts/:cart_id', asyncHandler(CartItemController.getCartItemById));
    route.post('/cartitems', validate(InsertCartItemsRequest), asyncHandler(CartItemController.insertCartItem));
    route.put('/cartitems/:id', requireRoles([UserRole.ADMIN]), asyncHandler(CartItemController.updateCartItem));
    route.delete('/cartitems/:id', requireRoles([UserRole.ADMIN, UserRole.USER]), asyncHandler(CartItemController.deleteCartItem));

    route.get('/products', asyncHandler(ProductController.getProducts));
    route.get('/products/:id', asyncHandler(ProductController.getProductById));
    route.post('/products', validate(InsertProductRequest), asyncHandler(ProductController.insertProduct));
    route.put('/products/:id',  validate(UpdateProductRequest), asyncHandler(ProductController.updateProduct));
    route.delete('/products/:id', asyncHandler(ProductController.deleteProduct));

    route.get('/news-details', asyncHandler(NewDetailController.getNewsDetails));
    route.get('/news-details/:id', asyncHandler(NewDetailController.NewsDetailsById));
    route.post('/news-details', requireRoles([UserRole.ADMIN]), asyncHandler(NewDetailController.insertNewsDetails));
    route.put('/news-details/:id', requireRoles([UserRole.ADMIN]), asyncHandler(NewDetailController.updateNewsDetails));
    route.delete('/news-details/:id', requireRoles([UserRole.ADMIN]), asyncHandler(NewDetailController.deleteNewsDetails));

    route.get('/categories', asyncHandler(CategoryController.getCategories));
    route.get('/categories/:id', asyncHandler(CategoryController.getCategoryById));
    route.post('/categories', requireRoles([UserRole.ADMIN]), asyncHandler(CategoryController.insertCategory));
    route.put('/categories/:id', requireRoles([UserRole.ADMIN]), asyncHandler(CategoryController.updateCategory));
    route.delete('/categories/:id', asyncHandler(CategoryController.deleteCategory));

    route.get('/brands', asyncHandler(BrandController.getBrands));
    route.get('/brands/:id', asyncHandler(BrandController.getBrandById));
    route.post('/brands', requireRoles([UserRole.ADMIN]), asyncHandler(BrandController.insertBrand));
    route.put('/brands/:id', requireRoles([UserRole.ADMIN]), asyncHandler(BrandController.updateBrand));
    route.delete('/brands/:id', requireRoles([UserRole.ADMIN]), asyncHandler(BrandController.deleteBrand));

    route.get('/orders', asyncHandler(OrderController.getOrders));
    route.get('/orders/:id', asyncHandler(OrderController.getOrderById));
    route.post('/orders', validate(InsertOrderRequest), asyncHandler(OrderController.insertOrder));
    route.put('/orders/:id', requireRoles([UserRole.ADMIN]), asyncHandler(OrderController.updateOrder));
    route.delete('/orders/:id', requireRoles([UserRole.ADMIN]), asyncHandler(OrderController.deleteOrder));

    route.get('/order-details', asyncHandler(OrderDetailController.getOrderDetails));
    route.get('/order-details/:id', asyncHandler(OrderDetailController.getOrderDetailById));
    route.post('/order-details', requireRoles([UserRole.ADMIN]), asyncHandler(OrderDetailController.insertOrderDetail));
    route.put('/order-details/:id', requireRoles([UserRole.ADMIN]), asyncHandler(OrderDetailController.updateOrderDetail));
    route.delete('/order-details/:id', requireRoles([UserRole.ADMIN]), asyncHandler(OrderDetailController.deleteOrderDetail));

    route.get('/banners', asyncHandler(BannerController.getBanners));
    route.get('/banners/:id', asyncHandler(BannerController.getBannerById));
    route.post('/banners', requireRoles([UserRole.ADMIN]), validate(InsertBannerRequest), asyncHandler(BannerController.insertBanner));
    route.put('/banners/:id', requireRoles([UserRole.ADMIN]), asyncHandler(BannerController.updateBanner));
    route.delete('/banners/:id', requireRoles([UserRole.ADMIN]), asyncHandler(BannerController.deleteBanner));

    route.get('/banner-details', asyncHandler(BannerDetailController.getBannerDetails));
    route.get('/banner-details/:id', asyncHandler(BannerDetailController.getBannerDetailById));
    route.post('/banner-details', requireRoles([UserRole.ADMIN]), validate(InsertBannerDetailRequest), asyncHandler(BannerDetailController.insertBannerDetail));
    route.put('/banner-details/:id', requireRoles([UserRole.ADMIN]), asyncHandler(BannerDetailController.updateBannerDetail));
    route.delete('/banner-details/:id', requireRoles([UserRole.ADMIN]), asyncHandler(BannerDetailController.deleteBannerDetail));

    route.get('/product-images', asyncHandler(ProductImageController.getProductImages));
    route.get('/product-images/:id', asyncHandler(ProductImageController.getProductImageById));
    route.post('/product-images', requireRoles([UserRole.ADMIN]), validate(InsertProductImageRequest), asyncHandler(ProductImageController.insertProductImage));
    route.delete('/product-images/:id', requireRoles([UserRole.ADMIN]), asyncHandler(ProductImageController.deleteProductImage));

    route.get('/images/all', asyncHandler(ImageController.getAllImages));
    route.get('/images/:fileName', asyncHandler(ImageController.viewImage));
    route.post('/images/upload', uploadImageMiddleware.array('images', 1), asyncHandler(ImageController.uploadImages));
    route.delete('/images/:fileName', requireRoles([UserRole.ADMIN]), asyncHandler(ImageController.deleteImage));

    route.post('/send-otp', OtpController.sendOtp);
    route.post('/verify-otp', OtpController.verifyOtp);

    route.post('/paymentzalopay', PaymentController.createPayment);

    app.use('/api/', route);
}