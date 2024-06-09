import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import BookList from './components/Books/BookList';
import BookDetail from './components/Books/BookDetail';
import ItemList from './components/Items/ItemList';
import ItemDetail from './components/Items/ItemDetail';
import CampaignList from './components/Dungeons/CampaignList';
import DungeonDetail from './components/Dungeons/CampaignDetail';
import Home from './components/Home/Home';
import Navbar from './components/Layout/Navbar';
import { AuthProvider } from './context/AuthContext';

const { Header, Content } = Layout;

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Layout>
                <Header>
                    <Navbar />
                </Header>
                <Content style={{ padding: '8px' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/edit" element={<EditProfile />} />
                        <Route path="/books" element={<BookList />} />
                        <Route path="/books/:id" element={<BookDetail />} />
                        <Route path="/items" element={<ItemList />} />
                        <Route path="/items/:id" element={<ItemDetail />} />
                        <Route path="/campaigns" element={<CampaignList />} />
                        <Route path="/campaigns/:id" element={<DungeonDetail />} />
                    </Routes>
                </Content>
            </Layout>
        </AuthProvider>
    );
};

export default App;