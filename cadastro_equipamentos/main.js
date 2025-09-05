const { createApp, ref, computed } = Vue;

const STORAGE_KEY = 'equipamentos-catalogo';

const App = {
    data() {
        return {
            equipamentos: [],
            equipamentoForm: {
                id: null,
                nome: '',
                categoria: '',
                patrimonio: '',
                status: 'disponível'
            },
            isEditando: false,
            filtroStatus: '',
            filtroCategoria: ''
        };
    },
    
    computed: {
        // R7a: Contadores computados
        totalEquipamentos() {
            return this.equipamentos.length;
        },
        totalDisponiveis() {
            return this.equipamentos.filter(e => e.status === 'disponível').length;
        },
        totalEmprestados() {
            return this.equipamentos.filter(e => e.status === 'emprestado').length;
        },
        formularioValido() {
            return this.equipamentoForm.nome && this.equipamentoForm.categoria && this.equipamentoForm.patrimonio;
        },
        
        // R7b: Lista filtrada por categoria e/ou status
        equipamentosFiltrados() {
            let listaFiltrada = this.equipamentos;

            // Filtro por status
            if (this.filtroStatus) {
                listaFiltrada = listaFiltrada.filter(e => e.status === this.filtroStatus);
            }

            // Filtro por categoria (ignora maiúsculas/minúsculas)
            if (this.filtroCategoria) {
                const termoFiltro = this.filtroCategoria.toLowerCase();
                listaFiltrada = listaFiltrada.filter(e => e.categoria.toLowerCase().includes(termoFiltro));
            }

            return listaFiltrada;
        }
    },

    methods: {
        carregarEquipamentos() {
            const dadosSalvos = localStorage.getItem(STORAGE_KEY);
            if (dadosSalvos) {
                this.equipamentos = JSON.parse(dadosSalvos);
            }
        },
        salvarEquipamentos() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.equipamentos));
        },
        
        salvarEquipamento() {
            if (this.isEditando) {
                const index = this.equipamentos.findIndex(e => e.id === this.equipamentoForm.id);
                if (index !== -1) {
                    this.equipamentos[index] = { ...this.equipamentoForm };
                }
            } else {
                const novoId = Date.now(); // ID único simples
                const novoEquipamento = { ...this.equipamentoForm, id: novoId };
                this.equipamentos.push(novoEquipamento);
            }
            this.salvarEquipamentos();
            this.resetarFormulario();
        },
        
        editarEquipamento(equipamento) {
            this.isEditando = true;
            this.equipamentoForm = { ...equipamento };
            
            // Rola a tela para o formulário
            this.$nextTick(() => {
                const formElement = document.getElementById('form-equipamento');
                if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        },
        
        removerEquipamento(id) {
            if (window.confirm('Tem certeza que deseja remover este equipamento?')) {
                this.equipamentos = this.equipamentos.filter(e => e.id !== id);
                this.salvarEquipamentos();
            }
        },

        resetarFormulario() {
            this.isEditando = false;
            this.equipamentoForm = {
                id: null,
                nome: '',
                categoria: '',
                patrimonio: '',
                status: 'disponível'
            };
        }
    },
    
    // Lifecycle hook: chamado quando a aplicação é montada
    mounted() {
        this.carregarEquipamentos();
    }
};

createApp(App).mount('#app');
