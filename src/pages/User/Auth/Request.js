import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Textarea } from "../../../components/elements/ManagerTemplete";
import { Content, TextButton, TextFillButton, Title, Wrappers } from "../../../components/elements/UserContentTemplete"
import theme from "../../../styles/theme";
import $ from 'jquery';
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
const Request = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [post, setPost] = useState({});

    const noteRef = useRef();
    const replyRef = useRef();
    useEffect(() => {
        async function myAuth() {
            const { data: response } = await axios.get(`/api/auth`);
            if (response?.pk > 0) {

            } else {
                alert("로그인이 필요합니다.");
                navigate('/login')
            }
        }
        myAuth();
        async function fetchPost() {
            const { data: response } = await axios.post('/api/myitem', {
                table: 'request',
                pk: params?.pk
            })
            setPost(response?.data);
            await new Promise((r) => setTimeout(r, 400));
            $('.title_').val(response?.data?.title);
            $('.note').val(response?.data?.note);
            $('.reply').val(response?.data?.reply_note);
        }
        if (params?.pk > 0) {
            fetchPost();
        }
    }, [])
    const onRequest = async () => {
        if (!$('.title_').val() || !$('.note').val()) {
            alert("필수 값이 비어있습니다.");
            return;
        }
        if (window.confirm("저장 하시겠습니까?")) {
            const { data: response } = await axios.post('/api/additembyuser', {
                table: 'request',
                title: $('.title_').val(),
                note: $('.note').val(),
            })
            if (response?.result > 0) {
                alert("성공적으로 저장되었습니다.");
                navigate('/servicecenter', { state: { type_num: 1 } })
            } else {
                alert(response?.message);
            }
        }
    }
    return (
        <Wrappers>
            <Content>
                <Title>문의하기</Title>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ maxWidth: '48px', fontSize: theme.size.font4, fontWeight: 'bold', width: '10%' }}>제목</div>
                    <Input style={{ margin: '0 0 0 8px', width: '80%', padding: '14px 8px' }} className='title_' disabled={params?.pk > 0 ? true : false} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '16px' }}>
                    <div style={{ maxWidth: '48px', fontSize: theme.size.font4, fontWeight: 'bold', width: '10%' }}>내용</div>
                    <ReactQuill
                        value={post?.note ?? `<body></body>`}
                        readOnly={true}
                        theme={"bubble"}
                        bounds={'.app'}
                        ref={noteRef}
                    />
                </div>
                {post?.status == 1 ?
                    <>
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '16px' }}>
                            <div style={{ width: '48px', fontSize: theme.size.font4, fontWeight: 'bold' }}>답변</div>
                            <ReactQuill
                                value={post?.reply_note ?? `<body></body>`}
                                readOnly={true}
                                theme={"bubble"}
                                bounds={'.app'}
                                ref={replyRef}
                            />
                        </div>
                        <div style={{ display: "flex", marginTop: '16px', marginLeft: 'auto' }}>
                            <TextButton style={{ margin: '0 4px 0 0' }} onClick={() => navigate(-1)}>뒤로가기</TextButton>
                        </div>
                    </>
                    :
                    <>
                        <div style={{ display: "flex", marginTop: '16px', marginLeft: 'auto' }}>
                            <TextButton style={{ margin: '0' }} onClick={() => navigate(-1)}>취소</TextButton>
                            {params?.pk > 0 ?
                                <>
                                </>
                                :
                                <>
                                    <TextFillButton style={{ margin: '0 0 0 8px' }} onClick={onRequest}>완료</TextFillButton>
                                </>}
                        </div>
                    </>}

            </Content>
        </Wrappers>
    )
}
export default Request;