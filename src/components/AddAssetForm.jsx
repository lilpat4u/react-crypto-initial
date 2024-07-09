import {Select, Space, Divider, Form, InputNumber, Button, DatePicker, Result} from 'antd'
import { useRef, useState } from 'react'
import { useCrypto } from '../context/crypto-context'
import CoinInfo from './CoinInfo'



export default function AddAssetForm({ onClose}) {
    const [form] = Form.useForm()
    const [coin, setCoin] = useState(null)
    const {crypto, addAsset} = useCrypto()
    const [submitted, setSubmitted] = useState(false)
    
    
    const assetRef = useRef()

    if (submitted) {
        return (
        <Result
        status="success"
        title="Successfully Asset Added"
        subTitle={`Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}`}
        extra = {[
          <Button type="primary" key="console" onClick={onClose}>
            Close
          </Button>
        ]}
      />   
    )
    }

    if (!coin) {
        return (
            <Select
            onSelect={(v) => setCoin(crypto.find((c)=> c.id === v))}
            placeholder='Select coin'
            style={{
              width: '30%',
            }}
            options={crypto.map((coin) => ({
              label: coin.name,
              value: coin.id,
              icon: coin.icon,
  
            }))}
            optionRender={(option) => (
              <Space>
                <img style={{width: 20}} src={option.data.icon} /> {option.data.label}
              </Space>
            )}
          />
        )
    }


    function onFinish(values) {
      const newAsset = {
        id: coin.id,
        amount: values.amount,
        price: values.price,
        date: values.date?.$d ?? new Date(),
      }
      assetRef.current = newAsset
        console.log('finish',values)
        setSubmitted(true)
        addAsset(newAsset)
    }

    const validateMessages = {
        required: '${label} is required!',
        rypes: {
            number: '${label} is not valid number',
        },
        number: {
            range: '${lanel} must be between ${min} and ${max}',
        },
    }

    function hanldeAmountChange(value) {
        const price = form.getFieldValue('price')
        form.setFieldsValue({
            total: +(value * price),
        })
    }

    function hanldePriceChange(value) {
        const amount = form.getFieldValue('amount')
        form.setFieldsValue({
            total: +(value * amount),
        })
    }
    


    return (
    <>
        <CoinInfo coin={coin} />
        <Divider />
        <Form
    form={form}
    name="basic"
    labelCol={{
      span: 4,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{
        price: +coin.price.toFixed(4),
    }}
    onFinish={onFinish}
    validateMessages = {validateMessages}
  >
    <Form.Item
      label="Amount"
      name="amount"
      rules={[
        {
          required: true,
          type: 'number',
          min: 0,
        },
      ]}
    >
      <InputNumber placeholder='Enter coin amount' onChange={hanldeAmountChange} style={{width: '100%'}} />
    </Form.Item>

    <Form.Item
      label="Price"
      name="price"
    >
      <InputNumber onChange={hanldePriceChange} style={{width: '100%'}}/>
    </Form.Item>

    <Form.Item
      label="Date & time"
      name="date"
    >
        <DatePicker showTime style={{width: '100%'}} />
    </Form.Item>

    <Form.Item
      label="Total"
      name="total"
    >
      <InputNumber disabled style={{width: '100%'}}/>
    </Form.Item>
    

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Add Asset
      </Button>
    </Form.Item>
  </Form>
    </>
    )
}