import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}

export function transactionList1(query) {
  return request({
    url: '/vue-element-admin/transaction/l1ist1',
    method: 'get',
    params: query
  })
}