/** 将 T 中的元素全部变为 any */
declare type Any<T> = {
  [key in keyof T]: any
}
