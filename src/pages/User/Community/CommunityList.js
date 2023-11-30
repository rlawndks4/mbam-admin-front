import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Title, Wrappers, ViewerContainer } from "../../../components/elements/UserContentTemplete";
import { axiosInstance, backUrl, communityCategoryList } from "../../../data/Data";
import theme from "../../../styles/theme";
import $ from 'jquery'
import styled from "styled-components";
import {  range } from "../../../functions/utils";
import Loading from '../../../components/Loading'
import SideSelectTypeComponent from "../../../components/SideSelectTypeComponent";
import ContentTable from "../../../components/ContentTable";
import PageContainer from "../../../components/elements/pagination/PageContainer";
import PageButton from "../../../components/elements/pagination/PageButton";
import MBottomContent from "../../../components/elements/MBottomContent";
import AddButton from "../../../components/elements/button/AddButton";

const RowContent = styled.div`
display:flex;
width:100%;
margin-top:24px;
@media screen and (max-width:700px) { 
    flex-direction:column;
}
`
const Content = styled.div`
margin:0 auto 1rem 300px;
width:100%;
font-size:${props => props.theme.size.font3};
display:flex;
flex-direction:column;
font-weight:normal;
max-width:800px;

@media screen and (max-width:850px) { 
    margin:0 auto;
}
`
const CommunityList = () => {

    const params = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(params?.table);
    const [categoryIdx, setCategoryIdx] = useState(0);

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageList, setPageList] = useState([]);
    useEffect(() => {
        let category_idx = 0;
        for (var i = 0; i < communityCategoryList.length; i++) {
            if (params?.table == communityCategoryList[i].table) {
                category_idx = i;
                break;
            }
        }
        setCategoryIdx(category_idx);
        getCommunityList(1);
    }, [params?.table])

    const getCommunityList = async (num) => {
        setLoading(true);
        setPage(num);
        const { data: response } = await axios.get(`/api/items?table=${params?.table}&page=${num}&page_size=15`);
        setData(response?.data?.data);
        setPageList(range(1, response?.data?.maxPage));
        setLoading(false);
    }
    const onClickCategory = (category) => {
        setCategory(category)
        navigate(`/community-list/${category}`);
    }
    return (
        <>
            <Wrappers className="post-container">

                <RowContent>
                    <SideSelectTypeComponent
                        data={communityCategoryList}
                        schema={params?.table}
                        category={category}
                        onClickCategory={onClickCategory}
                        setTypeNum={() => { }}
                    />
                    <Content style={{ maxWidth: '750px' }}>
                        <Title>{communityCategoryList[categoryIdx].name}</Title>
                        {loading ?
                            <>
                                <Loading />
                            </>
                            :
                            <>
                                <ContentTable
                                    data={data}
                                    schema={category}
                                    table={category}
                                />
                            </>}
                        <MBottomContent>
                            {communityCategoryList[categoryIdx]?.is_write ?
                                <>
                                    <div style={{ width: '92px' }} />
                                </>
                                :
                                <>
                                    <div />
                                </>}
                            {pageList.length > 0 ?
                                <>
                                    <PageContainer>
                                        <PageButton onClick={() => getCommunityList(1)}>
                                            처음
                                        </PageButton>
                                        {pageList.map((item, index) => (
                                            <>
                                                <PageButton onClick={() => getCommunityList(item)} style={{ color: `${page == item ? '#fff' : ''}`, background: `${page == item ? theme.color.background1 : ''}`, display: `${Math.abs(index + 1 - page) > 4 ? 'none' : ''}` }}>
                                                    {item}
                                                </PageButton>
                                            </>
                                        ))}
                                        <PageButton onClick={() => getCommunityList(pageList.length ?? 1)}>
                                            마지막
                                        </PageButton>
                                    </PageContainer>
                                </>
                                :
                                <>
                                    <div />
                                </>}

                            {communityCategoryList[categoryIdx]?.is_write ?
                                <>
                                    <AddButton style={{ width: '92px' }} onClick={() => {
                                        navigate(`/add-community/${category}`)
                                    }}>+ 작성하기</AddButton>
                                </>
                                :
                                <>
                                    <div />
                                </>}
                        </MBottomContent>
                    </Content>
                </RowContent>
            </Wrappers>
        </>
    )
}
export default CommunityList;