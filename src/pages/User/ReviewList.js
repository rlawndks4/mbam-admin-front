import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import theme from '../../styles/theme';
import axios from 'axios';
import { backUrl, slideSetting } from '../../data/Data';
import { Wrappers, Title, Content, Card, Img, WrapDiv, SliderDiv, ShadowContainer, RowContent } from '../../components/elements/UserContentTemplete';
import Loading from '../../components/Loading';
import $ from 'jquery';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import AcademyCard from '../../components/AcademyCard';
import SelectTypeComponent from '../../components/SelectTypeComponent';
import ReviewCard from '../../components/ReviewCard';
import { makeQueryObj, range } from '../../functions/utils';
import MBottomContent from '../../components/elements/MBottomContent';
import PageContainer from '../../components/elements/pagination/PageContainer';
import PageButton from '../../components/elements/pagination/PageButton';


const ReviewList = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [posts, setPosts] = useState([]);
    const location = useLocation();
    const [typeNum, setTypeNum] = useState(0);
    const [subTypeNum, setSubTypeNum] = useState(0);
    const [master, setMaster] = useState({});
    const [academyList, setAcademyList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [masterList, setMasterList] = useState([]);
    const [page, setPage] = useState(1);
    const [pageList, setPageList] = useState([]);
    const [reviewList, setReviewList] = useState([]);
    async function fetchPost() {
        const { data: response } = await axios.get('/api/items?table=user&level=30&status=1');
        let master_list = [...response?.data];
        for (var i = 0; i < master_list.length; i++) {
            master_list[i]['title'] = master_list[i]['nickname'];
        }
        setMasterList([...[{ title: '전체' }], ...master_list]);
        $('span.lazy-load-image-background').addClass('width-100');
    }
    useEffect(() => {
        fetchPost();
    }, [])
    useEffect(() => {
        if (masterList.length > 0) {
            checkQuery();
        }
    }, [masterList, location.search])
    const checkQuery = async () => {
        if (location.search) {
            let search = await makeQueryObj(location.search);
            selectTypeNum(search?.type, search?.page);
        } else {
            selectTypeNum(0, 1);
        }
    }
    const selectTypeNum = async (num, page) => {
        setTypeNum(num);
        setPage(page ?? 1);
        let api_str = `/api/getreviewbymasterpk?page=${page ?? 1}`;
        if (num > 0) {
            api_str += `&pk=${masterList[num]?.pk}`;
        }
        const { data: response } = await axios.get(api_str);
        setReviewList(response?.data?.data);
        setPageList(range(1, response?.data?.maxPage));
    }
    const changePage = (num, page) => {
        navigate(`/reviewlist?page=${page ?? 1}&type=${num}`);
    }
    return (
        <>
            <Wrappers className='wrappers'>
                {loading ?
                    <>
                    </>
                    :
                    <>
                        <Title className='pointer' link={'/academylist'} line={true}>수강후기</Title>
                        <SelectTypeComponent selectTypeNum={changePage} num={typeNum}
                            posts={masterList} subTypePadding={'16px 0'} />
                        <Content>
                            {reviewList && reviewList.map((item, idx) => (
                                <>
                                    <ReviewCard item={item} />
                                </>
                            ))}
                            <MBottomContent>
                                <div />
                                <PageContainer>
                                    <PageButton onClick={() => changePage(typeNum, 1)}>
                                        처음
                                    </PageButton>
                                    {pageList.map((item, index) => (
                                        <>
                                            <PageButton onClick={() => changePage(typeNum, item)} style={{ color: `${page == item ? '#fff' : ''}`, background: `${page == item ? theme.color.background1 : ''}`, display: `${Math.abs(index + 1 - page) > 4 ? 'none' : ''}` }}>
                                                {item}
                                            </PageButton>
                                        </>
                                    ))}
                                    <PageButton onClick={() => changePage(typeNum, pageList.length ?? 1)}>
                                        마지막
                                    </PageButton>
                                </PageContainer>
                                <div />
                            </MBottomContent>
                        </Content>
                    </>}


            </Wrappers>
        </>
    )
}
export default ReviewList;