import { Form, Input, Button, Card, Switch } from 'antd';  
import styles from './style.module.css';

export const AuthForm = ({
    title,
    subtitle,
    fields=[],
    buttonText,
    loading,
    onSubmit,  
    }) => {
    
        const [form] = Form.useForm(); 

        return (
            <div className={styles.authPage}>
                <Card className={styles.card} title={
                    <div className={styles.cardHeader}>
                        {/* <Button type="text"
                            className={styles.cardHeaderButton}  
                            icon={<CloseOutlined />}
                            onClick={() => navigate('/')}
                        />         */}
                        <span className={styles.cardHeaderTitle}>{title}</span> 
                        {/* update password subtitle */}
                        { subtitle && 
                            <span style={{fontSize: 14, fontWeight: 'normal'}}> 
                                {subtitle}
                            </span>
                        }
                    </div>
                } 
                >
                  { fields && fields.length > 0 && (
                    <Form 
                        form={form} 
                        layout='vertical'
                        onFinish={onSubmit}
                        autoComplete='off'
                    >
                        { fields.map((field) => {
                            return (
                                <Form.Item className={field.name === 'email' ? styles.readonlyInput : ''}
                                    key={field.name}
                                    name={field.name}
                                    label={field.label}
                                    rules={field.rules}
                                    initialValue={field.value || undefined} 
                                >
                                    { field.type === 'password' ?
                                        <Input.Password placeholder={field.placeholder} /> 
                                        :
                                        <Input 
                                            placeholder={field.placeholder} 
                                            readOnly={field.name === 'email'}
                                        />
                                    }
                                </Form.Item>
                            );
                        })} 

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                            >
                               {buttonText}
                            </Button>
                        </Form.Item>
                    </Form>
                    )}
                </Card>
            </div>
        );
}