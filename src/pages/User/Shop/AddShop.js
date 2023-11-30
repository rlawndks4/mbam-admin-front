import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Title, Wrappers, ViewerContainer } from "../../../components/elements/UserContentTemplete";
import { axiosInstance, backUrl, communityCategoryList } from "../../../data/Data";
import theme from "../../../styles/theme";
import $ from 'jquery'
import styled from "styled-components";
import { base64toFile, categoryToNumber, commarNumber, getViewerMarginByNumber } from "../../../functions/utils";
import Loading from '../../../components/Loading'
import { Input } from "../../../components/elements/ManagerTemplete";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";
import AddButton from "../../../components/elements/button/AddButton";
const Font = ReactQuill.Quill.import('formats/font');


const AddShop = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [note, setNote] = useState('')
    const [phone, setPhone] = useState('')
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [
                    { header: [1, 2, 3, 4, 5, 6] },
                    { font: [] }
                ],
                [{ size: [] }],
                [{ color: [] }, { background: [] }],
                ["bold", "italic", "underline", "strike", "blockquote", "regular"],
                [{ align: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "video"],
                ["emoji"],
                ["clean"],
                ["code-block"]
            ],
        },
        "emoji-toolbar": true,
        "emoji-textarea": true,
        "emoji-shortname": true
    }), [])
    const formats = [
        'font',
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'align', 'color', 'background',
    ]
    Quill.register("modules/imageResize", ImageResize);
    Quill.register(
        {
            "formats/emoji": quillEmoji.EmojiBlot,
            "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
            "modules/emoji-textarea": quillEmoji.TextAreaEmoji,
            "modules/emoji-shortname": quillEmoji.ShortNameEmoji
        },
        true
    );

    useEffect(() => {
        async function isUser() {
            const { data: response } = await axios.get('/api/auth', {
                headers: {
                    'Content-type': 'application/json',
                }
            },
                { withCredentials: true });
            if (response.pk > 0) {
                setUser(response);
            } else {
                alert('로그인 후 이용 가능합니다.');
                navigate('/login');
            }
        }
        isUser();

    }, [])
    const onSave = async () => {
        if (!$('.name').val() ||
            !$('.phone').val()) {
            alert("필수값을 입력해 주세요.");
            return;
        }
        if (window.confirm("정말로 저장 하시겠습니까?")) {
            let obj = {
                name: $('.name').val(),
                request_note: note,
                phone: $('.phone').val(),
                table: 'shop',
                option_list: '[]',
                country_list: '[]',
                price_list: '[]'
            }

            const { data: response } = await axios.post('/api/additembyuser', obj)
            if (response?.result > 0) {
                alert('성공적으로 저장 되었습니다.');
                navigate(-1);
            } else {
                alert(response?.message);
            }
        }
    }
    return (
        <>
            <Wrappers className="post-container">
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <Title>제휴문의</Title>
                        <Input style={{ width: '98%', margin: '1rem auto 0 0', padding: '0.75rem 1%', maxWidth: '1157px' }} placeholder="제목을 입력해 주세요." className="name" />
                        <Input style={{ width: '98%', margin: '1rem auto 0 0', padding: '0.75rem 1%', maxWidth: '1157px' }} placeholder="전화번호를 입력해 주세요." className="phone" />
                        <div id='editor' style={{ width: '100%', margin: '1rem auto' }}>
                            <ReactQuill
                                modules={modules}
                                theme="snow"
                                defaultValue={note}
                                value={note}
                                placeholder="업체설명을 작성해 주세요."
                                onChange={async (e) => {
                                    try {
                                        let note = e;
                                        if (e.includes('<img src="') && e.includes('base64,')) {
                                            let base64_list = e.split('<img src="');
                                            for (var i = 0; i < base64_list.length; i++) {
                                                if (base64_list[i].includes('base64,')) {
                                                    let img_src = base64_list[i];
                                                    img_src = await img_src.split(`"></p>`);
                                                    let base64 = img_src[0];
                                                    img_src = await base64toFile(img_src[0], 'note.png');
                                                    let formData = new FormData();
                                                    await formData.append('note', img_src);
                                                    const { data: response } = await axios.post('/api/addimageitems', formData);
                                                    note = await note.replace(base64, `${backUrl + response?.data[0]?.filename}`)
                                                }
                                            }
                                        }
                                        setNote(note);
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }}
                            />
                        </div>
                    </>
                }
                <AddButton style={{ margin: '1rem 0 0 auto' }} onClick={onSave}>저장</AddButton>
            </Wrappers>
        </>
    )
}
export default AddShop;