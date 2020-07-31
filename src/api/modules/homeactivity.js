import base from "./base"
import mergeDeep from "@/utils/merge_deep"
import {axios} from "@/utils/request"


export default mergeDeep(base, {
  table_name: 'homeactivity',
})
