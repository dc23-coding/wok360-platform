<script>
import NavigationModal from '@/components/NavigationModal.vue';

export default {
  components: { NavigationModal },
  data() {
    return {
      showModal: false,
      videoUrl: '',
    };
  },
  async mounted() {
    try {
      const { data, error } = await supabase
        .storage
        .from('videos')
        .getPublicUrl('Harvest-intro.mp4');
      if (error) {
        console.error('Error loading video:', error);
      } else {
        console.log('Video URL:', data.publicUrl); // Should log the Supabase URL
        this.videoUrl = data.publicUrl;
      }
    } catch (err) {
      console.error('Failed to fetch video URL:', err);
    }
  },
  methods: {
    openModal() {
      console.log('Button clicked, showModal:', this.showModal);
      this.showModal = true;
    },
    handleVideoError(e) {
      console.error('Video failed to load:', e);
    },
  },
};
</script>