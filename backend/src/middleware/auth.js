const { supabaseAdmin } = require('../utils/supabase')
const prisma = require('../utils/prisma')

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        studentProfile: true,
        staffProfile: true
      }
    })

    if (!dbUser || !dbUser.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or deactivated' })
    }

    req.user = dbUser
    req.token = token
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Authentication failed' })
  }
}

module.exports = { authenticate }
