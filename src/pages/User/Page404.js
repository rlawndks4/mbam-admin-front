import { Icon } from "@iconify/react"
import { Wrappers } from "../../components/elements/UserContentTemplete"

const Page404 = () =>{

    return (
        <>
        <Wrappers>
            <Icon icon='tabler:error-404' style={{
                margin:'auto auto 0.5rem auto',
                fontSize:'84px'
            }}/>
            <div style={{
                margin:'0.5rem auto auto auto'
            }}>페이지를 찾을 수 없습니다.</div>
        </Wrappers>
        </>
    )
}
export default Page404