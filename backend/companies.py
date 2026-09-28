# Banco de fornecedores fictícios para o protótipo — dados de demonstração,
# não representam empresas reais. Usado pelo agente para sugerir fornecedores
# depois de fechar o diagnóstico em uma das categorias do catálogo fechado.

EMPRESAS = [
    # Financeiro / BPO
    {
        "id": "contabiliza-bpo",
        "nome": "Contabiliza BPO",
        "categoria": "Financeiro / BPO",
        "cnpj": "12.345.678/0001-90",
        "cidade": "São Paulo, SP",
        "avaliacao": 4.8,
        "descricao": "BPO financeiro completo: contas a pagar/receber, conciliação e fluxo de caixa.",
    },
    {
        "id": "fluxo-certo-consultoria-financeira",
        "nome": "Fluxo Certo Consultoria Financeira",
        "categoria": "Financeiro / BPO",
        "cnpj": "23.456.789/0001-01",
        "cidade": "Belo Horizonte, MG",
        "avaliacao": 4.6,
        "descricao": "Organização financeira para PMEs, com relatórios gerenciais mensais.",
    },
    # Tecnologia
    {
        "id": "nimbustech-sistemas",
        "nome": "NimbusTech Sistemas",
        "categoria": "Tecnologia",
        "cnpj": "34.567.890/0001-12",
        "cidade": "Florianópolis, SC",
        "avaliacao": 4.9,
        "descricao": "Desenvolvimento de software sob demanda e manutenção de sistemas legados.",
    },
    {
        "id": "infrastack-ti",
        "nome": "InfraStack TI",
        "categoria": "Tecnologia",
        "cnpj": "45.678.901/0001-23",
        "cidade": "Curitiba, PR",
        "avaliacao": 4.5,
        "descricao": "Infraestrutura, servidores e suporte técnico para empresas.",
    },
    # Limpeza
    {
        "id": "higioclean-servicos",
        "nome": "Higioclean Serviços",
        "categoria": "Limpeza",
        "cnpj": "56.789.012/0001-34",
        "cidade": "Rio de Janeiro, RJ",
        "avaliacao": 4.7,
        "descricao": "Limpeza predial, higienização e sanitização de ambientes corporativos.",
    },
    {
        "id": "arfrio-manutencao-e-limpeza",
        "nome": "ArFrio Manutenção e Limpeza",
        "categoria": "Limpeza",
        "cnpj": "67.890.123/0001-45",
        "cidade": "Campinas, SP",
        "avaliacao": 4.4,
        "descricao": "Especializada em limpeza e manutenção de ar-condicionado comercial.",
    },
    # Manutenção Predial
    {
        "id": "predialtech-manutencao",
        "nome": "PredialTech Manutenção",
        "categoria": "Manutenção Predial",
        "cnpj": "78.901.234/0001-56",
        "cidade": "Porto Alegre, RS",
        "avaliacao": 4.6,
        "descricao": "Manutenção elétrica, hidráulica e reformas em imóveis comerciais.",
    },
    {
        "id": "elevar-engenharia-predial",
        "nome": "Elevar Engenharia Predial",
        "categoria": "Manutenção Predial",
        "cnpj": "89.012.345/0001-67",
        "cidade": "Recife, PE",
        "avaliacao": 4.3,
        "descricao": "Manutenção de elevadores e reparo de infiltrações/vazamentos.",
    },
    # Marketing
    {
        "id": "alcance-marketing-digital",
        "nome": "Alcance Marketing Digital",
        "categoria": "Marketing",
        "cnpj": "90.123.456/0001-78",
        "cidade": "São Paulo, SP",
        "avaliacao": 4.8,
        "descricao": "Gestão de redes sociais, tráfego pago e branding para PMEs.",
    },
    {
        "id": "conteudo-vivo-agencia",
        "nome": "Conteúdo Vivo Agência",
        "categoria": "Marketing",
        "cnpj": "01.234.567/0001-89",
        "cidade": "Fortaleza, CE",
        "avaliacao": 4.5,
        "descricao": "Criação de conteúdo e estratégia de divulgação para redes sociais.",
    },
    # Jurídico
    {
        "id": "vertice-advocacia-empresarial",
        "nome": "Vértice Advocacia Empresarial",
        "categoria": "Jurídico",
        "cnpj": "11.222.333/0001-90",
        "cidade": "Brasília, DF",
        "avaliacao": 4.9,
        "descricao": "Contratos, compliance e questões trabalhistas para empresas.",
    },
    {
        "id": "legalis-consultoria-juridica",
        "nome": "Legalis Consultoria Jurídica",
        "categoria": "Jurídico",
        "cnpj": "22.333.444/0001-01",
        "cidade": "Salvador, BA",
        "avaliacao": 4.4,
        "descricao": "Assessoria jurídica contínua e revisão de contratos comerciais.",
    },
    # RH
    {
        "id": "genteplena-rh",
        "nome": "GentePlena RH",
        "categoria": "RH",
        "cnpj": "33.444.555/0001-12",
        "cidade": "São Paulo, SP",
        "avaliacao": 4.7,
        "descricao": "Recrutamento, seleção e gestão de benefícios para empresas de todos os portes.",
    },
    {
        "id": "talento-ativo-consultoria",
        "nome": "Talento Ativo Consultoria",
        "categoria": "RH",
        "cnpj": "44.555.666/0001-23",
        "cidade": "Goiânia, GO",
        "avaliacao": 4.5,
        "descricao": "Treinamento, onboarding e estruturação de processos de contratação.",
    },
]


def buscar_por_categoria(categoria: str):
    return [e for e in EMPRESAS if e["categoria"].lower() == categoria.lower()]


def buscar_por_id(empresa_id: str):
    return next((e for e in EMPRESAS if e["id"] == empresa_id), None)
