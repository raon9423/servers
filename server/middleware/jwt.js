import getUserFromToken from '../helpers/token';

const requireRoles = (rolesRequired) => async (req, res, next) => {
    try{
        const user = await getUserFromToken(req, res);
        if (!user) return; 

        if (!rolesRequired.includes(user.role)) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        req.user = user; 
        next(); 
        
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

export default requireRoles;
