interface Person {
  positionName?: string
  mobile?: string
  attributionUnit?: string
  department?: string
  job?: string
  userName?: string
  deptName?: string
}

function positionAndPhone(person: Person) {
  const pn = person?.positionName || ''
  const mobile = person?.mobile || ''
  return addStr(pn, mobile)
}
function orgAndDept(person: Person) {
  const at = person?.attributionUnit || ''
  const dm = person?.department || ''
  return addStr(at, dm)
}
function positionAndName(person: Person) {
  const pos = person?.job || ''
  const userName = person?.userName || ''
  return addStr(pos, userName)
}

function deptAndName(person: Person) {
  const department = person?.deptName || ''
  const name = person?.userName || ''

  return addStr(department, name)
}

function addStr(str1: string, str2: string) {
  return `${str1}${str1 && str2 ? ' - ' : ''}${str2}`
}

export { positionAndPhone, orgAndDept, positionAndName, deptAndName }
