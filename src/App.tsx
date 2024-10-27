import { useState, useEffect } from "react";
import itemStore from "./store/itemStore";
import { observer } from "mobx-react";
import { Card, Spin, Input, Modal, Form, Button } from "antd";
import type { FormProps } from "antd";
import { EditOutlined, StopOutlined } from "@ant-design/icons";
import { modify } from "./utils/helpers";
import "./App.css";

const App = observer(() => {
  const [from, setFrom] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [currentCardId, setCurrentCardId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCardClick = (id: number) => {
    setCurrentCardId(id);
  };

  type FieldType = {
    version?: string;
    description?: string;
    homepage?: string;
  };

  const onFinish = (values: {
    homepage: string;
    version: string;
    description: string;
    id: number;
  }) => {
    console.log("Success:", values);
    itemStore.editItem({ ...values, id: currentCardId });
    console.log({ ...values, id: currentCardId });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (fetching) {
      setSpinning(true);
      fetch(`https://api.npms.io/v2/search?q=react&from=${from}&size=24`)
        .then((res) => res.json())
        .then((data) => {
          itemStore.setItems(modify([...itemStore.items, ...data.results]));
          setFrom((prev) => prev + 24);
        })
        .finally(() => {
          setFetching(false);
          setSpinning(false);
        });
    }
  }, [fetching, from]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollHandler = (e: Event) => {
    if (
      (e.target as Document).documentElement.scrollHeight -
        ((e.target as Document).documentElement.scrollTop +
          window.innerHeight) <
      100
    ) {
      setFetching(true);
    }
  };

  return (
    <div>
      <div className="itemList">
        {itemStore.items.map((item, index) => {
          return (
            <Card
              className="item"
              key={index}
              title={item.package.name}
              style={{ fontSize: 20, textWrap: "wrap" }}
              actions={[
                <StopOutlined
                  key="delete"
                  onClick={() => itemStore.deleteItem(item.id)}
                />,
                <EditOutlined
                  key="edit"
                  onClick={() => {
                    handleCardClick(item.id);
                    //console.log(item.id);
                    console.log(currentCardId);
                    //setDisabling(!disabling);
                    showModal();
                  }}
                />,
              ]}
            >
              <p>{"ID: " + item.id}</p>
              <p>{"Version: " + item.package.version}</p>
              <p>{"Description: " + item.package.description}</p>
              <p>
                Homepage:
                <br />
                <a href={item.package.links.homepage}>
                  {item.package.links.homepage}
                </a>
              </p>
            </Card>
          );
        })}
      </div>
      <Spin spinning={spinning} size="large" fullscreen />
      <Modal
        title="Изменение параметров..."
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType> label="Version" name="version">
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="Description" name="description">
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="Homepage" name="homepage">
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default App;
