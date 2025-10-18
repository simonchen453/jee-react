import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';

function Home() {
    return (
        <div>
            <h1>仪表盘</h1>
            
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总用户数"
                            value={1128}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="订单数量"
                            value={93}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总收入"
                            value={112893}
                            prefix={<DollarOutlined />}
                            suffix="¥"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="访问量"
                            value={1128}
                            prefix={<EyeOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="最近订单" style={{ height: 300 }}>
                        <p>订单数据将在这里显示...</p>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="快速操作" style={{ height: 300 }}>
                        <p>这里可以添加快速操作按钮</p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Home;
