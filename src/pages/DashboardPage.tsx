import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layout,
  Typography,
  Button,
  Card,
  Row,
  Col,
  Space,
  Modal,
  Input,
  Select,
  Empty,
  App,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileTextOutlined,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import { useResumeStore } from '../stores/resumeStore'

const { Header, Content } = Layout
const { Title, Text } = Typography

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { message, modal } = App.useApp()
  const { resumes, create, remove, importJson } = useResumeStore()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTemplate, setNewTemplate] = useState('cabernet')
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [renameTitle, setRenameTitle] = useState('')
  const [originalTitle, setOriginalTitle] = useState('')
  const [pendingImport, setPendingImport] = useState<unknown>(null)

  const isTitleTaken = (title: string) =>
    resumes.some((r) => r.title.toLowerCase() === title.trim().toLowerCase())

  const handleCreate = () => {
    if (!newTitle.trim()) {
      message.warning('Please enter a title')
      return
    }
    if (isTitleTaken(newTitle)) {
      message.warning('A resume with this name already exists. Please choose a different name.')
      return
    }
    const item = create(newTitle, newTemplate)
    message.success('Resume created!')
    setCreateModalOpen(false)
    setNewTitle('')
    navigate(`/editor/${item.id}`)
  }

  const handleDelete = (id: string, title: string) => {
    modal.confirm({
      title: 'Delete Resume',
      content: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        remove(id)
        message.success('Resume deleted')
      },
    })
  }

  const handleDownloadPdf = (id: string) => {
    navigate(`/editor/${id}?pdf=1`)
  }

  const handleExportJson = (id: string, title: string) => {
    const resume = useResumeStore.getState().getById(id)
    if (!resume) return
    const exportData = { title: resume.title, templateName: resume.templateName, data: resume.data }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${title}.json`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    message.success('JSON exported!')
  }

  const doImport = (parsed: unknown, titleOverride?: string) => {
    const data = parsed as Record<string, unknown>
    if (titleOverride) {
      (data as Record<string, unknown>).title = titleOverride
    }
    importJson(data)
    message.success('Resume imported!')
  }

  const handleImportJson = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const parsed = JSON.parse(text)
        const title = (parsed as Record<string, unknown>).title as string || file.name.replace('.json', '')
        if (isTitleTaken(title)) {
          setPendingImport(parsed)
          setOriginalTitle(title)
          setRenameTitle(title)
          setRenameModalOpen(true)
        } else {
          doImport(parsed)
        }
      } catch {
        message.error('Failed to import JSON. Check the file format.')
      }
    }
    input.click()
  }

  const handleRenameConfirm = () => {
    if (!renameTitle.trim()) {
      message.warning('Please enter a title')
      return
    }
    if (isTitleTaken(renameTitle)) {
      message.warning('This name is also taken. Please choose a different one.')
      return
    }
    doImport(pendingImport, renameTitle)
    setRenameModalOpen(false)
    setPendingImport(null)
    setRenameTitle('')
    setOriginalTitle('')
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Layout className="dashboard-layout">
      <Header className="dashboard-header">
        <div className="header-left">
          <FileTextOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          <Title level={4} style={{ margin: 0, color: '#fff' }}>
            Resume Builder
          </Title>
        </div>
      </Header>

      <Content className="dashboard-content">
        <div style={{
          background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 50%, #69b1ff 100%)',
          borderRadius: 16,
          padding: '28px 36px',
          marginBottom: 36,
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
              Resume Builder
            </div>
            <div style={{ fontSize: 14, opacity: 0.85 }}>
              {resumes.length === 0
                ? 'Create your first resume and land your dream job.'
                : `You have ${resumes.length} resume${resumes.length > 1 ? 's' : ''}. Keep them updated.`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              icon={<ImportOutlined />}
              onClick={handleImportJson}
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 8, height: 40, fontWeight: 500 }}
            >
              Import JSON
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
              style={{ background: '#fff', color: '#1677ff', border: 'none', borderRadius: 8, height: 40, fontWeight: 600, paddingInline: 20 }}
            >
              New Resume
            </Button>
          </div>
        </div>

        <div className="dashboard-toolbar">
          <Title level={4} style={{ margin: 0, color: '#374151' }}>
            My Resumes ({resumes.length})
          </Title>
        </div>

        {resumes.length === 0 ? (
          <div className="center-spin">
            <Empty
              description="No resumes yet. Create your first one!"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalOpen(true)}
              >
                Create Resume
              </Button>
            </Empty>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {resumes.map((resume) => (
              <Col xs={24} sm={12} lg={8} key={resume.id}>
                <Card
                  hoverable
                  className="resume-card"
                  onClick={() => navigate(`/editor/${resume.id}`)}
                  style={{ cursor: 'pointer' }}
                  actions={[
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadPdf(resume.id)
                      }}
                      key="download"
                    >
                      PDF
                    </Button>,
                    <Button
                      type="link"
                      icon={<ExportOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportJson(resume.id, resume.title)
                      }}
                      key="export"
                    >
                      Export JSON
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{resume.title}</span>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined style={{ fontSize: 18 }} />}
                          size="middle"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(resume.id, resume.title)
                          }}
                        />
                      </div>
                    }
                    description={
                      <div style={{ marginTop: 4 }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: 11,
                          fontWeight: 500,
                          color: '#1677ff',
                          background: '#e6f4ff',
                          padding: '2px 8px 2px 0',
                          borderRadius: 12,
                          marginBottom: 6,
                          textTransform: 'capitalize',
                        }}>
                          {resume.templateName}
                        </span>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                          Updated {formatDate(resume.updatedAt)}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Content>

      <Modal
        title="Create New Resume"
        open={createModalOpen}
        onOk={handleCreate}
        onCancel={() => {
          setCreateModalOpen(false)
          setNewTitle('')
        }}
        okText="Create"
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Resume Title
            </Text>
            <Input
              placeholder="e.g., Software Engineer Resume"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onPressEnter={handleCreate}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Template
            </Text>
            <Select
              value={newTemplate}
              onChange={setNewTemplate}
              style={{ width: '100%' }}
              options={[
                { label: '── Classic Collection ──', options: [
                  { value: 'riesling', label: 'Riesling' },
                  { value: 'barolo', label: 'Barolo' },
                  { value: 'sauvignon', label: 'Sauvignon' },
                  { value: 'malbec', label: 'Malbec' },
                  { value: 'champagne', label: 'Champagne' },
                  { value: 'bordeaux', label: 'Bordeaux' },
                  { value: 'pinot-grigio', label: 'Pinot Grigio' },
                  { value: 'cabernet', label: 'Cabernet' },
                  { value: 'prosecco', label: 'Prosecco' },
                ]},
                { label: '── Tech Collection ──', options: [
                  { value: 'absinthe', label: 'Absinthe' },
                  { value: 'hennessy', label: 'Hennessy' },
                  { value: 'tanqueray', label: 'Tanqueray' },
                  { value: 'belvedere', label: 'Belvedere' },
                  { value: 'lagavulin', label: 'Lagavulin' },
                  { value: 'macallan', label: 'Macallan' },
                  { value: 'aperol', label: 'Aperol' },
                  { value: 'chartreuse', label: 'Chartreuse' },
                  { value: 'glenfiddich', label: 'Glenfiddich' },
                  { value: 'courvoisier', label: 'Courvoisier' },
                ]},
                { label: '── Premium Collection ──', options: [
                  { value: 'dom-perignon', label: 'Dom Perignon' },
                  { value: 'veuve-clicquot', label: 'Veuve Clicquot' },
                  { value: 'armagnac', label: 'Armagnac' },
                  { value: 'amarone', label: 'Amarone' },
                  { value: 'opus-one', label: 'Opus One' },
                  { value: 'romanee', label: 'Romanee' },
                  { value: 'cristal', label: 'Cristal' },
                  { value: 'sassicaia', label: 'Sassicaia' },
                  { value: 'krug', label: 'Krug' },
                  { value: 'petrus', label: 'Petrus' },
                ]},
              ]}
            />
          </div>
        </Space>
      </Modal>

      <Modal
        title="Duplicate Name"
        open={renameModalOpen}
        onOk={handleRenameConfirm}
        onCancel={() => {
          setRenameModalOpen(false)
          setPendingImport(null)
          setRenameTitle('')
          setOriginalTitle('')
        }}
        okText="Import"
      >
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            A resume named "{originalTitle}" already exists. Please enter a different name:
          </Text>
          <Input
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.target.value)}
            onPressEnter={handleRenameConfirm}
            placeholder="Enter a new name"
          />
        </div>
      </Modal>
    </Layout>
  )
}

export default DashboardPage
