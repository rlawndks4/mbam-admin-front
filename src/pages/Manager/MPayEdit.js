import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import MItemEditComponent from "../../components/MItemEditComponent"
import { objManagerEditContent } from "../../data/Manager/ManagerContentData";
import $ from 'jquery';
import axios from "axios";
import { returnMoment } from "../../functions/utils";
import { GiUfo } from "react-icons/gi";
import { Col, Explain, Input, Row, Title } from "../../components/elements/ManagerTemplete";
import theme from "../../styles/theme";
const MPayEdit = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [classObj, setClassObj] = useState({})
    const [userObj, setUserObj] = useState({})
    useEffect(() => {
        async function fetchPost() {
            const { data: response } = await axios.get(`/api/item?table=subscribe&pk=${params?.pk}`);
            setClassObj(response?.data);
            const { data: response2 } = await axios.get(`/api/item?table=user&pk=${response?.data?.user_pk}`);
            setUserObj(response2?.data);
        }
        fetchPost();
    }, [])
    const editItemByParent = async () => {
        if (params.pk == 0) {
            addItem();
        } else {
            editItem();
        }
    }
    const addItem = async () => {

    }
    const editItem = async () => {
        if (window.confirm("저장하시겠습니까?")) {
            const { data: response } = await axios.post('/api/updateitem', {
                table: 'user',
                account_holder: $('.account_holder').val(),
                bank_name: $('.bank_name').val(),
                account_number: $('.account_number').val(),
                pk: userObj?.pk
            })
            const { data: response2 } = await axios.post('/api/updateitem', {
                table: 'subscribe',
                price: (classObj?.transaction_status == 0 ? $('.price').val() : parseInt($('.price').val()) * (-1)),
                pk: params?.pk
            })
            if (response?.result > 0 && response2?.result > 0) {
                alert("성공적으로 저장되었습니다.");
                navigate(-1);
            } else {
                alert("서버에러 발생");
            }
        }

    }
    return (
        <>
            <MItemEditComponent schema={'pay_edit'} params_pk={params.pk} editItemByParent={editItemByParent}
                editContent={<>
                    <Row>
                        <Col>
                            <Title>{classObj?.price > 0 ? '승인금액' : '취소금액'}</Title>
                            <Input className="price" type={'number'} defaultValue={classObj?.price > 0 ? classObj?.price : (classObj?.price * (-1))} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Title>유저아이디</Title>
                            <Explain style={{ fontSize: theme.size.font3 }}>{userObj?.id}</Explain>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Title>예금주</Title>
                            <Input className="account_holder" defaultValue={userObj?.account_holder} />
                        </Col>
                        <Col>
                            <Title>은행명</Title>
                            <Input className="bank_name" defaultValue={userObj?.bank_name} />
                        </Col>
                        <Col>
                            <Title>계좌번호</Title>
                            <Input className="account_number" defaultValue={userObj?.account_number} />
                        </Col>
                    </Row>
                </>} />
        </>
    )
}
export default MPayEdit;