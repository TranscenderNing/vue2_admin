import * as tradeMark from '@/api/product/tradeMark'
import * as attr from '@/api/product/attr'
import * as spu from '@/api/product/spu'
import * as sku from '@/api/product/sku'
// 引入权限相关的
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'


export default {
    tradeMark,
    attr,
    spu,
    sku,
    user,
    role,
    permission,
}

