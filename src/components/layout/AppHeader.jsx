import { Layout, Select, Space, Button, Modal, Drawer } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useCrypto } from '../../context/crypto-context';
import CoinInfoModal from '../CoinInfoModal';
import AddAssetForm from '../AddAssetForm';


  const headerStyle = {
    width: '100%',
    textAlign: 'center',
    height: 60,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  export default function AppHeader() {
    const [select, setSelect] = useState(false)
    const [modal, setModal] = useState(false)
    const [coin, setCoin] = useState(null)
    const [drawer, setDrawer] = useState(false)
    const {crypto} = useCrypto()

    useEffect(() => {
      const keypress = (event) => {
        if (event.key === '/') {
          setSelect(prev => !prev)
        }
      }
      document.addEventListener('keypress', keypress)
      return () => document.removeEventListener('keypress', keypress)
    }, [])

    function handleSelect(value) {
      setCoin(crypto.find((c) => c.id === value))
      setModal(true)
      return(console.log(value))
    }
    return (
    <Layout.Header style={headerStyle}>
      <Select
          open={select}
          onSelect={handleSelect}
          onClick={() => setSelect(prev => !prev)} 
          value='press / to open'
          style={{
            width: '20%',
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
     <Button type="primary" onClick={() => setDrawer(true)}>Add asset</Button>

     <Modal open={modal} footer={null} onCancel={() => setModal(false)}>
          <CoinInfoModal coin={coin}/>
      </Modal>
      <Drawer destroyOnClose
      width={600} title='Add asset' onClose={() => setDrawer(false)} open={drawer}>
        <AddAssetForm onClose={() => setDrawer(false)} />
      </Drawer>
    </Layout.Header>
    )
  }