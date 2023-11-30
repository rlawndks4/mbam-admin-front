import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import ManagerWrappers from '../../components/elements/ManagerWrappers';
import SideBar from '../../common/manager/SideBar';
import ManagerContentWrappers from '../../components/elements/ManagerContentWrappers';
import axios from 'axios';
import Breadcrumb from '../../common/manager/Breadcrumb';
import ButtonContainer from '../../components/elements/button/ButtonContainer';
import AddButton from '../../components/elements/button/AddButton';
import CancelButton from '../../components/elements/button/CancelButton';
import $ from 'jquery';
import { addItem, base64toFile, updateItem } from '../../functions/utils';
import { Table, Tr, Td, Card, Title, Input, Row, Col, ImageContainer, Select, Container, SectorInput, Explain, Textarea } from '../../components/elements/ManagerTemplete';
import { backUrl } from '../../data/Data';
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";
import DaumPostcode from 'react-daum-postcode';
import Modal from '../../components/Modal';
import { AiFillFileImage } from 'react-icons/ai';
import theme from '../../styles/theme';
import { RiDeleteBinLine } from 'react-icons/ri';
export const SectorAddButton = styled.button`
width:770px;
border:1px solid ${props => props.theme.color.font4};
background:#fff;
cursor:pointer;
height:36px;
`
const MShopEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [priceUrl, setPriceUrl] = useState('')
    const [priceContent, setPriceContent] = useState(undefined)
    const [formData] = useState(new FormData())
    const [addressList, setAddressList] = useState([])
    const [isSelectAddress, setIsSelectAddress] = useState(false);
    const [note, setNote] = useState("");
    const [priceNote, setPriceNote] = useState("");
    const [requestNote, setRequestNote] = useState("");
    const [isSeePostCode, setIsSeePostCode] = useState(false);
    const [priceList, setPriceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [subCityList, setSubCityList] = useState([]);
    const [subCityObj, setSubCityObj] = useState({});
    const [themeList, setThemeList] = useState([]);
    const [optionList, setOptionList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    useEffect(() => {

        async function fetchPost() {
            try {


                const { data: z_city } = await axios.get(`/api/items?table=city`);
                setCityList(z_city?.data);
                let city_list = [...z_city?.data];
                let sub_city_obj = {};
                for (var i = 0; i < city_list.length; i++) {
                    sub_city_obj[city_list[i]?.pk] = [];
                }
                const { data: z_sub_city } = await axios.get(`/api/items?table=sub_city`);
                let sub_city_list = [...z_sub_city.data];
                for (var i = 0; i < sub_city_list.length; i++) {
                    if(sub_city_obj[sub_city_list[i]?.city_pk]){
                        sub_city_obj[sub_city_list[i]?.city_pk].push(sub_city_list[i]);
                    }
                }
                setSubCityObj(sub_city_obj)
                sub_city_list = sub_city_obj[city_list[0]?.pk]
                const { data: z_shop_option } = await axios.get(`/api/items?table=shop_option`);
                setOptionList(z_shop_option?.data);
                const { data: z_shop_theme } = await axios.get(`/api/items?table=shop_theme`);
                setThemeList(z_shop_theme?.data)
                const { data: z_shop_country } = await axios.get(`/api/items?table=shop_country`);
                setCountryList(z_shop_country?.data)
                if (params.pk > 0) {
                    const { data: response } = await axios.get(`/api/item?table=shop&pk=${params.pk}`)
                    sub_city_list = sub_city_obj[response?.data?.city_pk];
                    setSubCityList(sub_city_list);
                    setUrl(backUrl + response?.data?.img_src)
                    setPriceUrl(backUrl + response?.data?.price_img)
                    $('.name').val(response.data.name)
                    $('.sub_name').val(response.data.sub_name)
                    $('.description').val(response.data.description)
                    $('.city_1').val(response.data.city_1)
                    $('.city_2').val(response.data.city_2)
                    $('.img_src_alt').val(response.data.img_src_alt)
                    $('.price_img_alt').val(response.data.price_img_alt)
                    $('.price_img_link').val(response.data.price_img_link)
                    $('.hash').val(response.data.hash)
                    $('.phone').val(response.data.phone)
                    $('.city_pk').val(response.data.city_pk)
                    $('.theme_pk').val(response.data.theme_pk)
                    $('.zip_code').val(response.data.zip_code)
                    $('.address').val(response.data.address)
                    $('.address_detail').val(response.data.address_detail)
                    $('.show_address').val(response.data.show_address)
                    $('.lng').val(response.data.lng)
                    $('.lat').val(response.data.lat)
                    setNote(response?.data?.note);
                    setPriceNote(response?.data?.price_note);
                    setRequestNote(response?.data?.request_note);

                    let price_list = JSON.parse(response?.data?.price_list);
                    setPriceList(price_list);
                    await new Promise((r) => setTimeout(r, 500));
                    $('.sub_city_pk').val(response.data.sub_city_pk)

                    let option_list = JSON.parse(response?.data?.option_list);
                    for (var i = 0; i < option_list.length; i++) {
                        $(`#option-${option_list[i]}`).prop('checked', true);
                    }
                    let country_list = JSON.parse(response?.data?.country_list);
                    for (var i = 0; i < country_list.length; i++) {
                        $(`#country-${country_list[i]}`).prop('checked', true);
                    }
                    for (var i = 0; i < price_list.length; i++) {
                        $(`.course-td-1-${i}`).val(price_list[i]?.course)
                        $(`.course-td-2-${i}`).val(price_list[i]?.price)
                        $(`.course-td-3-${i}`).val(price_list[i]?.sale_price)
                    }

                } else {
                    setSubCityList(sub_city_list);
                }
                settingJquery();
            } catch (err) {
                console.log(err)
            }
        }
        fetchPost();
    }, [])
    const settingJquery = () => {
        $('.ql-editor').attr('style', 'max-height:300px !important');
        $('.ql-editor').attr('style', 'min-height:300px !important');
    }
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
    const editShop = async () => {
        if (
            !$(`.name`).val() ||
            !$(`.sub_name`).val() ||
            !$(`.hash`).val() ||
            !$(`.city_pk`).val() ||
            !$(`.sub_city_pk`).val() ||
            !$(`.phone`).val() ||
            !$(`.theme_pk`).val() ||
            !$(`.zip_code`).val() ||
            !$(`.address`).val() ||
            !$(`.address_detail`).val() ||
            !$(`.show_address`).val() ||
            !$(`.lng`).val() ||
            !$(`.lat`).val()
        ) {
            alert('필요값이 비어있습니다.');
        } else {
            let obj = {
                name: $(`.name`).val(),
                sub_name: $(`.sub_name`).val(),
                description: $(`.description`).val(),
                city_1: $(`.city_1`).val(),
                city_2: $(`.city_2`).val(),
                img_src_alt: $(`.img_src_alt`).val(),
                price_img_alt: $(`.price_img_alt`).val(),
                price_img_link: $(`.price_img_link`).val(),
                hash: $(`.hash`).val(),
                phone: $(`.phone`).val(),
                city_pk: $(`.city_pk`).val(),
                sub_city_pk: $(`.sub_city_pk`).val(),
                theme_pk: $(`.theme_pk`).val(),
                zip_code: $(`.zip_code`).val(),
                address: $(`.address`).val(),
                address_detail: $(`.address_detail`).val(),
                show_address: $(`.show_address`).val(),
                lng: $(`.lng`).val(),
                lat: $(`.lat`).val(),
                table: 'shop',
                note: note,
                price_note: priceNote
            }
            if (content) {
                let formData = new FormData();
                formData.append('content', content);
                const { data: add_image } = await axios.post('/api/addimageitems', formData);
                obj['img_src'] = add_image?.data[0]?.filename;
            }
            if (priceContent) {
                let formData = new FormData();
                formData.append('content', priceContent);
                const { data: add_image } = await axios.post('/api/addimageitems', formData);
                obj['price_img'] = add_image?.data[0]?.filename;
            }
            let price_list = [];
            for (var i = 0; i < priceList.length; i++) {
                if ($(`.course-tr-${i}`).css('display') != 'none') {
                    price_list.push({
                        course: $(`.course-td-1-${i}`).val(),
                        price: $(`.course-td-2-${i}`).val(),
                        sale_price: $(`.course-td-3-${i}`).val(),
                    })
                }
            }
            obj['price_list'] = JSON.stringify(price_list);

            let option_list = [];
            for (var i = 0; i < optionList.length; i++) {
                if ($(`#option-${optionList[i]?.pk}`).is(':checked')) {
                    option_list.push(optionList[i]?.pk)
                }
            }
            obj['option_list'] = JSON.stringify(option_list);

            let country_list = [];
            for (var i = 0; i < countryList.length; i++) {
                if ($(`#country-${countryList[i]?.pk}`).is(':checked')) {
                    country_list.push(countryList[i]?.pk)
                }
            }
            obj['country_list'] = JSON.stringify(country_list);

            if (params?.pk > 0) {
                obj['pk'] = params.pk;
            }
            if (window.confirm(`${params.pk == 0 ? '추가하시겠습니까?' : '수정하시겠습니까?'}`)) {
                const { data: response } = await axios.post(`/api/${params?.pk == 0 ? 'add' : 'update'}item`, obj);
                if (response?.result > 0) {
                    alert("성공적으로 저장 되었습니다.");
                    navigate('/manager/list/shop');
                } else {
                    alert(response.message);
                }
            }

        }


    }
    const onSelectAddress = async (data) => {
        setIsSeePostCode(false);
        const { data: response } = await axios.post('/api/getaddressbytext', {
            text: data?.autoJibunAddress || data?.jibunAddress
        })
        if (response?.data?.length > 0) {
            $('.address').val(data?.autoJibunAddress || data?.jibunAddress);
            $('.zip_code').val(data?.zonecode);
            $('.address_detail').val("");
            $('.address_detail').focus();
            $('.lng').val(response?.data[0]?.lng);
            $('.lat').val(response?.data[0]?.lat);
        } else {
            alert("위치추적 할 수 없는 주소입니다.");
        }

    }

    const onClickXbutton = () => {
        setIsSeePostCode(false);
    }
    const addFile = (e) => {
        if (e.target.files[0]) {
            setContent(e.target.files[0]);
            setUrl(URL.createObjectURL(e.target.files[0]))
        }
    };

    const addPriceFile = (e) => {
        if (e.target.files[0]) {
            setPriceContent(e.target.files[0]);
            setPriceUrl(URL.createObjectURL(e.target.files[0]))
        }
    };
    const onChangeCity = (e) => {
        setSubCityList(subCityObj[e.target.value]);
    }
    return (
        <>
            <Breadcrumb title={params.pk == 0 ? '업체 추가' : '업체 수정'} nickname={myNick} />
            <Card>
                <Row>
                    <Col>
                        <Title>메인 이미지 (480x320 추천)</Title>
                        <ImageContainer for="file1" style={{ display: 'flex' }}>

                            {url ?
                                <>
                                    <img src={url} alt="#"
                                        style={{
                                            width: 'auto', height: '150px',
                                            margin: 'auto'
                                        }} />
                                </>
                                :
                                <>
                                    <AiFillFileImage style={{ margin: 'auto', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                </>}
                        </ImageContainer>
                        <div>
                            <input type="file" id="file1" onChange={addFile} style={{ display: 'none' }} />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>메인이미지 알트내용</Title>
                        <Input className='img_src_alt' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>디스크립션</Title>
                        <Textarea className='description' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>링크 첫번째 도시명</Title>
                        <Input className='city_1' />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>링크 두번째 도시명</Title>
                        <Input className='city_2' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>업체명</Title>
                        <Input className='name' />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>업체명 부제목</Title>
                        <Input className='sub_name' />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>해시태그</Title>
                        <Input className='hash' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>업체 전화번호</Title>
                        <Input className='phone' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>도시</Title>
                        <Select className='city_pk' onChange={onChangeCity}>
                            {cityList && cityList.map((item, idx) => (
                                <>
                                    <option value={item?.pk}>{item?.name}</option>
                                </>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>구</Title>
                        <Select className='sub_city_pk' >
                            {subCityList && subCityList.map((item, idx) => (
                                <>
                                    <option value={item?.pk}>{item?.name}</option>
                                </>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>테마</Title>
                        <Select className='theme_pk'>
                            {themeList && themeList.map((item, idx) => (
                                <>
                                    <option value={item?.pk}>{item?.name}</option>
                                </>
                            ))}
                        </Select>
                    </Col>
                </Row>

                <Col>
                    <Title>우편번호</Title>
                    <div style={{ display: 'flex' }}>
                        <Input style={{ margin: '12px 0 6px 24px' }} className='zip_code' placeholder="예) 12345" />
                        <AddButton style={{ margin: '12px auto 6px 12px', width: '104px' }} onClick={() => { setIsSeePostCode(!isSeePostCode) }}>우편번호검색</AddButton>
                    </div>
                </Col>
                <Row>
                    <Col>
                        <Title>주소</Title>
                        <Input className='address' />
                    </Col>
                    <Col>
                        <Title>표시용주소</Title>
                        <Input className='show_address' />
                    </Col>
                    <Col>
                        <Title>상세주소</Title>
                        <Input className='address_detail' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>경도</Title>
                        <Input className='lng' disabled={true} />
                    </Col>
                    <Col>
                        <Title>위도</Title>
                        <Input className='lat' disabled={true} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {isSeePostCode ?
                            <>
                                <Modal onClickXbutton={onClickXbutton}>
                                    <DaumPostcode style={postCodeStyle} onComplete={onSelectAddress} />
                                </Modal>
                            </>
                            :
                            <>
                            </>}
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Title>코스</Title>
                        <Container>
                            <Table>
                                <Tr>
                                    <Td>코스명</Td>
                                    <Td>가격(숫자만)</Td>
                                    <Td>할인가(숫자만)</Td>
                                    <Td style={{ width: '20%' }}>삭제</Td>
                                </Tr>
                                {priceList && priceList.map((item, idx) => (
                                    <>
                                        <Tr className={`course-tr-${idx}`}>
                                            <Td ><SectorInput className={`course-td-1-${idx}`} /></Td>
                                            <Td ><SectorInput className={`course-td-2-${idx}`} /></Td>
                                            <Td ><SectorInput className={`course-td-3-${idx}`} /></Td>
                                            <Td style={{ width: '20%' }}><RiDeleteBinLine style={{ cursor: 'pointer' }} onClick={() => { $(`.course-tr-${idx}`).css('display', 'none') }} /></Td>
                                        </Tr>
                                    </>
                                ))}
                            </Table>
                            <SectorAddButton onClick={() => { setPriceList([...priceList, ...[{}]]) }}>+추가</SectorAddButton>
                        </Container>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Explain>가격 및 할인가 공백시 대분류</Explain>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>가격설명</Title>
                        <div id='editor'>
                            <ReactQuill
                                modules={modules}
                                theme="snow"
                                defaultValue={priceNote}
                                value={priceNote}
                                onChange={async (e) => {
                                    try {
                                        let note = e;
                                        console.log(e)
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
                                        setPriceNote(note);
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>코스 아래 이미지</Title>
                        <ImageContainer for="file2" style={{ display: 'flex' }}>

                            {priceUrl ?
                                <>
                                    <img src={priceUrl} alt="#"
                                        style={{
                                            width: 'auto', height: '150px',
                                            margin: 'auto'
                                        }} />
                                </>
                                :
                                <>
                                    <AiFillFileImage style={{ margin: 'auto', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                </>}
                        </ImageContainer>
                        <div>
                            <input type="file" id="file2" onChange={addPriceFile} style={{ display: 'none' }} />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>코스아래이미지 알트내용</Title>
                        <Input className='price_img_alt' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>코스아래이미지 링크</Title>
                        <Input className='price_img_link' />
                    </Col>
                </Row>
                <Title>옵션</Title>
                <Row style={{ margin: '1rem auto 1rem 24px' }}>
                    {optionList?.map((item, idx) => (
                        <div>
                            <input id={`option-${item?.pk}`} type={'checkbox'} />
                            <label for={`option-${item?.pk}`}>
                                {item?.name}
                            </label>
                        </div>
                    ))}
                </Row>
                <Title>국가</Title>
                <Row style={{ margin: '1rem auto 1rem 24px' }}>
                    {countryList?.map((item, idx) => (
                        <div>
                            <input id={`country-${item?.pk}`} type={'checkbox'} />
                            <label for={`country-${item?.pk}`}>
                                {item?.name}
                            </label>
                        </div>
                    ))}
                </Row>

                <Row>
                    <Col>
                        <Title>업체설명</Title>
                        <div id='editor'>
                            <ReactQuill
                                modules={modules}
                                theme="snow"
                                defaultValue={note}
                                value={note}
                                onChange={async (e) => {
                                    try {
                                        let note = e;
                                        console.log(e)
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
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>문의업체설명</Title>
                        <div id='editor'>
                            <ReactQuill
                                modules={modules}
                                theme="snow"
                                defaultValue={requestNote}
                                value={requestNote}
                                onChange={async (e) => {
                                    try {
                                        let note = e;
                                        console.log(e)
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
                                        setRequestNote(note);
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            </Card>
            <ButtonContainer>
                <CancelButton onClick={() => navigate(-1)}>x 취소</CancelButton>
                <AddButton onClick={editShop}>{params.pk == 0 ? '+ 추가' : '수정'}</AddButton>
            </ButtonContainer>
        </>
    )
}
const postCodeStyle = {
    display: 'block',
    position: 'relative',
    top: '0%',
    width: '90%',
    height: '450px',
    margin: '16px auto'
};
export default MShopEdit;