import { useParams } from "react-router-dom"
import MItemEditComponent from "../../components/MItemEditComponent"

const MItemEdit = () => {
    const params = useParams();
    return (
        <>
            <MItemEditComponent schema={params.table} params_pk={params.pk} />
        </>
    )
}
export default MItemEdit;